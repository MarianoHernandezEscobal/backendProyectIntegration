import { ApiProperty } from '@nestjs/swagger';
import { PropertyEntity } from '@databaseProperties/property.entity';
import { PropertyStatus } from '../enums/status.enum';
import { PropertyTypes } from '../enums/types.enum';

export class PropertyPlpDto {
  @ApiProperty({ description: 'ID de la propiedad' })
  id: number;

  @ApiProperty({ description: 'Título de la propiedad' })
  title: string;

  @ApiProperty({ description: 'Descripción de la propiedad' })
  description: string;

  @ApiProperty({ description: 'Precio de la propiedad' })
  price: number;

  @ApiProperty({ description: 'Tipo de propiedad', enum: PropertyTypes })
  type: PropertyTypes;

  @ApiProperty({ description: 'Estado de la propiedad', enum: PropertyStatus, isArray: true })
  status: PropertyStatus[];

  @ApiProperty({ description: 'Imágenes de la propiedad', isArray: true })
  image: string[];

  constructor(property: PropertyEntity) {
    this.id = property.id;
    this.title = property.title;
    this.description = property.description;
    this.price = property.price;
    this.type = property.type;
    this.status = property?.status || [];
    this.image = property?.image || [];
  }
}