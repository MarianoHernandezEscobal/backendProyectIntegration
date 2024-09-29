import { PropertyTypes } from "@src/enums/types.enum";
import { GeoCoordinatesDto } from "@src/property/dto/geoCoordinates.dto";
import { PropertyEntity } from "@databaseProperties/property.entity";
import { PropertyStatus } from "../../enums/status.enum";
import { IsArray, IsEnum, IsNumber, IsString, IsBoolean, IsDate, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "@src/user/dto/user.dto";
import { RentDTO } from "@src/rent/dto/rent.dto";

export class PropertyDto {

    @ApiProperty({ description: 'ID de la propiedad' })
    id: number;

    @ApiProperty({ description: 'Título de la propiedad' })
    @IsString()
    title: string;

    @ApiProperty({ description: 'Descripción de la propiedad' })
    @IsString()
    description: string;

    @ApiProperty({ description: 'Precio de la propiedad' })
    @IsNumber()
    price: number;
    
    @ApiProperty({ description: 'Tipo de propiedad', enum: PropertyTypes })
    @IsEnum(PropertyTypes, { message: 'Invalid property type' })
    type: PropertyTypes;

    @ApiProperty({ description: 'Estado(s) de la propiedad', enum: PropertyStatus, isArray: true })
    @IsArray()
    @IsEnum(PropertyStatus, { each: true, message: 'Each value must be a valid PropertyStatus' })
    status: PropertyStatus[];

    @ApiProperty({ description: 'Metros cuadrados de la propiedad' })
    @IsNumber()
    m2: number;

    @ApiProperty({ description: 'Metros cuadrados de construcción de la propiedad' })
    @IsNumber()
    m2Construction: number;

    @ApiProperty({ description: 'Número de habitaciones' })
    @IsNumber()
    rooms: number;

    @ApiProperty({ description: 'Número de baños' })
    @IsNumber()
    bathrooms: number;

    @ApiProperty({ description: 'Dirección de la propiedad' })
    @IsString()
    address: string;

    @ApiProperty({ description: 'Coordenadas geográficas', type: () => GeoCoordinatesDto })
    @IsOptional()
    geoCoordinates: GeoCoordinatesDto;

    @ApiProperty({ description: 'Barrio de la propiedad' })
    @IsString()
    neighborhood: string;

    @ApiProperty({ description: 'Ciudad de la propiedad' })
    @IsString()
    city: string;

    @ApiProperty({ description: 'Año de construcción de la propiedad' })
    @IsString()
    year: string;

    @ApiProperty({ description: 'Imágenes de la propiedad', isArray: true })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    image: string[];

    @ApiProperty({ description: 'Contribución' })
    @IsString()
    contribution: string;

    @ApiProperty({ description: 'Propiedad pineada', default: false })
    @IsBoolean()
    pinned: boolean;

    @ApiProperty({ description: 'Propiedad aprobada', default: false })
    @IsBoolean()
    approved: boolean;

    @ApiProperty({ description: 'Fecha de creación de la propiedad' })
    @IsDate()
    createdAt: Date;

    constructor(property: PropertyEntity) {
        this.id = property.id;
        this.title = property.title;
        this.description = property.description;
        this.price = property.price;
        this.type = property.type;
        this.status = property?.status || [];
        this.m2 = property.m2;
        this.m2Construction = property.m2Construction;
        this.rooms = property.rooms;
        this.bathrooms = property.bathrooms;
        this.address = property.address;
        this.geoCoordinates = property?.geoCoordinates || null;
        this.neighborhood = property.neighborhood;
        this.city = property.city;
        this.year = property.year;
        this.image = property?.image || [];
        this.contribution = property.contribution;
        this.pinned = property.pinned;
        this.approved = property.approved;
        this.createdAt = property.createdAt;
    }
}
