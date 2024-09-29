import { Injectable, BadRequestException, HttpException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PropertyDto } from './dto/property.dto';
import { PropertiesDatabaseService } from '@databaseProperties/property.database.service';
import { PropertyEntity } from '@databaseProperties/property.entity';
import { PropertyPlpDto } from './dto/property.plp.dto';
import { PropertyStatus } from '../enums/status.enum';
import { Home } from './dto/home.response.dto';
import { UserResponseDto } from '@user/dto/user.response.dto';
import { FacebookClient } from '@clients/facebook/facebook.client';
import { CreatePost } from './dto/facebook.create.request.dto';
import { MercadoLibreClient } from '@src/clients/mercadoLibre/mercadoLibre.client';
import { firstValueFrom } from 'rxjs';
import { WhatsAppClient } from '@src/clients/whatsapp/whatsapp.client';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class PropertyService {
  constructor(
    private readonly propertiesDatabaseService: PropertiesDatabaseService,
    private readonly facebookService: FacebookClient,
    private readonly mercadoLibreService: MercadoLibreClient,
    private readonly whatsApp: WhatsAppClient

  ) {}

  private handleException(e: any, message: string): void {
    if (e instanceof BadRequestException || e instanceof NotFoundException || e instanceof UnauthorizedException) {
      throw e;
    }
    console.error(e);
    throw new HttpException(message, 500);
  }

  private async validatePropertyTitle(title: string): Promise<void> {
    const existingProperty = await this.propertiesDatabaseService.findTitle(title);
    if (existingProperty) {
      throw new BadRequestException('Ya existe una propiedad con ese título');
    }
  }

  async create(create: PropertyDto, user: UserResponseDto): Promise<PropertyDto> {
    try {
      await this.validatePropertyTitle(create.title);
      const entity = PropertyEntity.fromDto(create, user.admin);
      const savedProperty = await this.propertiesDatabaseService.create(entity);

      if (savedProperty.approved) {
        //const response = await firstValueFrom(this.mercadoLibreService.getAccessToken(''));
        await firstValueFrom(this.facebookService.createPost(new CreatePost(savedProperty)));
      }

      return new PropertyDto(savedProperty);
    } catch (e) {
      this.handleException(e, 'Error al crear la propiedad');
    }
  }

  async findOne(id: string): Promise<PropertyDto> {
    try {
      const idNumber = parseInt(id);
      const savedProperty = await this.propertiesDatabaseService.findOne(idNumber);
      if (!savedProperty) {
        throw new NotFoundException('Propiedad no encontrada');
      }
      return new PropertyDto(savedProperty);
    } catch (e) {
      this.handleException(e, 'Error al encontrar la propiedad');
    }
  }

  async home(): Promise<Home> {
    try {
      const rent = await this.propertiesDatabaseService.findHome(PropertyStatus.ForRent);
      const sale = await this.propertiesDatabaseService.findHome(PropertyStatus.ForSale);
      const pined = await this.propertiesDatabaseService.findPinned();

      if (!rent.length && !sale.length && !pined.length) {
        throw new NotFoundException('Propiedades no encontradas');
      }

      return {
        rent: rent.map(property => new PropertyPlpDto(property)),
        sale: sale.map(property => new PropertyPlpDto(property)),
        pined: pined.map(property => new PropertyPlpDto(property)),
      };
    } catch (e) {
      this.handleException(e, 'Error al obtener el home');
    }
  }

  async update(updateDto: PropertyDto, user: UserResponseDto): Promise<PropertyDto> {
    try {
      const property = await this.propertiesDatabaseService.findOne(updateDto.id);
      if (!property) {
        throw new NotFoundException('Propiedad no encontrada');
      }

      if (!user.admin && updateDto.approved !== undefined) {
        throw new UnauthorizedException('No tienes permisos para aprobar la propiedad');
      }

      if (!user.admin) {
        delete updateDto.approved;
      }

      const oldProperty = new PropertyDto(property);

      const updatedProperty = await this.propertiesDatabaseService.update(property, updateDto);

      if(updatedProperty.approved){
        await this.updatePostFacebook(updatedProperty, oldProperty);
        await this.sendMessages(updatedProperty);
      }
      
      return new PropertyDto(updatedProperty);
    } catch (e) {
      this.handleException(e, 'Error al actualizar la propiedad');
    }
  }

  private validatePropertyStatus(status: string): PropertyStatus {
    const propertyType = Object.values(PropertyStatus).find(type => type === status);
    if (!propertyType) {
      throw new BadRequestException(`Invalid property type: ${status}`);
    }
    return propertyType;
  }

  async filterStatus(status: string, page: number): Promise<PropertyPlpDto[]> {
    try {
      const propertyType = this.validatePropertyStatus(status);
      const properties = await this.propertiesDatabaseService.filterByStatus(propertyType, page);

      if (!properties.length) {
        throw new NotFoundException('Propiedades no encontradas');
      }

      return properties.map(property => new PropertyPlpDto(property));
    } catch (e) {
      this.handleException(e, 'Error al filtrar las propiedades');
    }
  }

  async findToApprove(): Promise<PropertyPlpDto[]> {
    try {
      const properties = await this.propertiesDatabaseService.findToApprove();
      if (!properties.length) {
        throw new NotFoundException('Propiedades no encontradas');
      }
      return properties.map(property => new PropertyPlpDto(property));
    } catch (e) {
      this.handleException(e, 'Error al filtrar las propiedades');
    }
  }

  private async sendMessages(property: PropertyEntity): Promise<void> {
    const {URL_INMO} = process.env;
    const propertie = await this.propertiesDatabaseService.findOne(property.id, ['users']);
    const users = propertie.users;
    users.forEach(user => {
      this.whatsApp.sendMessage(user.phone, `Hola ${user.firstName}, se actualizo tu propiedad favorita ${property.title}\n${URL_INMO}${property.id}`);	
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async renewFacebookTokens() {
    try {
      const userTokenResponse = await firstValueFrom(this.facebookService.renewAccessTokenUser());
      process.env.FACEBOOK_USER_ACCESSTOKEN = userTokenResponse.access_token;
      console.log('Nuevo User Access Token:', userTokenResponse.access_token);

      const pageTokensResponse = await firstValueFrom(this.facebookService.renewAccessTokenPage());
      console.log('Nuevo Page Access Token:', pageTokensResponse.data);

      const pageAccessToken = pageTokensResponse.data[0]?.access_token;
      if (pageAccessToken) {
        process.env.FACEBOOK_ACCESSTOKEN = pageAccessToken;
        console.log('Nuevo Page Access Token:', pageAccessToken);
      }

    } catch (error) {
      console.error('Error al renovar el Access Token:', error);
    }
  }

  private async updatePostFacebook(updatedProperty: PropertyEntity, oldProperty: PropertyDto): Promise<void> {
    try {
      const post = await firstValueFrom(this.facebookService.getPost());
      if (!post) {
        return;
      }
      const filterPost = post.find(p => p.message === `${oldProperty.title}\n${oldProperty.description}`);
      if (filterPost) {
        await firstValueFrom(this.facebookService.updatePost(new CreatePost(updatedProperty), filterPost.id));
        return;
      }
      await firstValueFrom(this.facebookService.createPost(new CreatePost(updatedProperty)));

    } catch (error) {
      console.error('Error al actualizar el post de Facebook:', error);
    }
  }
}
