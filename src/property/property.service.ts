import { Injectable, BadRequestException, HttpException, NotFoundException } from '@nestjs/common';
import { PropertyDto } from './dto/property.dto';
import { PropertiesDatabaseService } from '@databaseProperties/property.database.service';
import { PropertyEntity } from '@databaseProperties/property.entity';
import { PropertyPlpDto } from './dto/property.plp.dto';
import { PropertyStatus } from './enums/status.enum';



@Injectable()
export class PropertyService {
  constructor(
    private readonly propertiesDatabaseService: PropertiesDatabaseService,
  ) {}

  async create(create: PropertyDto): Promise<PropertyDto> {
    try {
      const property = await this.propertiesDatabaseService.findTitle(create.title);
      if (property) {
        throw new BadRequestException('Ya existe una propiedad con ese título');
      }
      const entitie = PropertyEntity.fromDto(create);
      const savedProperty = await this.propertiesDatabaseService.create(entitie);

      const propertyResponse = new PropertyDto(savedProperty);
      return propertyResponse;

    } catch (e) {
      if (e instanceof BadRequestException) {
        throw e;
      }
      console.error(e);
      throw new HttpException('Error al crear la propiedad', 500);
    }
  }

  async findOne(id: number): Promise<PropertyDto> {
    try {

      const savedProperty = await this.propertiesDatabaseService.findOne(id);

      if (!savedProperty) {
        throw new BadRequestException('Propiedad no encontrado');
      }

      const propertyResponse = new PropertyDto(savedProperty);
      return propertyResponse;

    } catch (e) {
      if (e instanceof BadRequestException) {
        throw e;
      }

      console.error(e);
      throw new HttpException('Error al crear la propiedad', 500);
    }
  }

  async home(): Promise<PropertyPlpDto[]> {
    try {
      const properties = await this.propertiesDatabaseService.findHome();

      if (!properties.length) {
        throw new BadRequestException('Propiedades no encontrado');
      }

      const response = properties.map((property) => new PropertyPlpDto(property));

      return response;

    } catch (e) {
      if (e instanceof BadRequestException) {
        throw e;
      }

      console.error(e);
      throw new HttpException('Error al crear la propiedad', 500);
    }
  }


  async update(updateDto: PropertyDto): Promise<PropertyDto> {
    try {
      const property = await this.propertiesDatabaseService.findOne(updateDto.id);
  
      if (!property) {
        throw new BadRequestException('Propiedad no encontrada');
      }

      const updatedProperty = await this.propertiesDatabaseService.update(property, updateDto);
      return new PropertyDto(updatedProperty);
    } catch (e) {
      if (e instanceof BadRequestException) {
        throw e;
      }
      console.error(e);
      throw new HttpException('Error al actualizar la propiedad', 500);
    }
  }

  async filterStatus(status: string): Promise<PropertyPlpDto[]> {
    try {
      const propertyType = Object.values(PropertyStatus).find((type) => type === status);

      if (!propertyType) {
        throw new BadRequestException(`Invalid property type: ${status}`);
      }
    
      const properties = await this.propertiesDatabaseService.filterByStatus(propertyType);

      if (!properties.length) {
        throw new NotFoundException('Propiedades no encontradas');
      }

      const response = properties.map((property) => new PropertyPlpDto(property));

      return response;

    } catch (e) {
      if (e instanceof BadRequestException) {
        throw e;
      }

      console.error(e);
      throw new HttpException('Error al filtrar las propiedades', 500);
    }
  }
  
}
