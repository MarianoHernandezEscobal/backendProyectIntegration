import { PropertyTypes } from "@src/property/enums/types.enum";
import { GeoCoordinatesDto } from "@src/property/dto/geoCoordinates.dto";
import { PropertyEntity } from "@databaseProperties/property.entity";
import { PropertyStatus } from "../enums/status.enum";
import { IsArray, IsEnum } from "class-validator";


export class PropertyDto {

    id: number;
    title: string;
    description: string;
    price: number;
    
    @IsEnum(PropertyTypes, { message: 'Invalid property type' })
    type: PropertyTypes;

    @IsArray()
    @IsEnum(PropertyStatus, { each: true, message: 'Each value must be a valid PropertyStatus' })
    status: PropertyStatus[];

    m2: number;
    m2Construction: number;
    rooms: number;
    bathrooms: number;
    address: string;
    geoCoordinates: GeoCoordinatesDto;
    neighborhood: string;
    city: string;
    year: string;
    image: string[];
    contribution: string;
    pinned: boolean;
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
        this.createdAt = property.createdAt;
    }
}