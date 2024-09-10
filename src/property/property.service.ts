import { Injectable, BadRequestException, HttpException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PropertyDto } from './dto/property.dto';
import { PropertiesDatabaseService } from '@databaseProperties/property.database.service';
import { PropertyEntity } from '@databaseProperties/property.entity';
import { PropertyPlpDto } from './dto/property.plp.dto';
import { PropertyStatus } from './enums/status.enum';
import { Home } from './dto/home.response.dto';
import { UserResponseDto } from '@user/dto/user.response.dto';

@Injectable()
export class PropertyService {
  constructor(
    private readonly propertiesDatabaseService: PropertiesDatabaseService,
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

      const updatedProperty = await this.propertiesDatabaseService.update(property, updateDto);
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
}
