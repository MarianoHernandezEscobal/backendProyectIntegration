import { BadRequestException } from '@nestjs/common';
import { GeoCoordinatesDto } from '@src/property/dto/geoCoordinates.dto';
import { PropertyDto } from '@src/property/dto/property.dto';
import { PropertyStatus } from '@src/property/enums/status.enum';
import { PropertyTypes } from '@src/property/enums/types.enum';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class PropertyEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    title: string;
    
    @Column()
    description: string;

    @Column()
    price: number;

    @Column({
        type: 'enum',
        enum: PropertyTypes,
      })
    type: PropertyTypes;
    
    @Column()
    m2: number;

    @Column({ type: 'simple-array', enum: PropertyStatus })
    status: PropertyStatus[];

    @Column()
    m2Construction: number;

    @Column()
    rooms: number;

    @Column()
    bathrooms: number;

    @Column()
    address: string;

    @Column('json', { nullable: true })
    geoCoordinates: GeoCoordinatesDto;

    @Column()
    neighborhood: string;

    @Column()
    city: string;

    @Column()
    year: string;

    @Column({ type: 'simple-array' })
    image: string[];

    @Column()
    contribution: string;

    @Column({ default: false })
    pinned: boolean;

    @Column({ default: false })
    approved: boolean;

    @CreateDateColumn()
    createdAt: Date;


    static fromDto(property: PropertyDto, approved: boolean): PropertyEntity {
        const entity = new PropertyEntity();
        entity.title = property.title;
        entity.description = property.description;
        entity.price = property.price;
        const propertyType = Object.values(PropertyTypes).find((type) => type === property.type);
        if (!propertyType) {
          throw new BadRequestException(`Invalid property type: ${property.type}`);
        }
        entity.type = propertyType;

        if (property.status) {
            property.status.forEach((status) => {
                const propertyStatus = Object.values(PropertyStatus).find((type) => type === status);
                if (!propertyStatus) {
                    throw new BadRequestException(`Invalid property status: ${status}`);
                }
            });
        }

        entity.status = property.status;
        entity.m2 = property.m2;
        entity.m2Construction = property.m2Construction;
        entity.rooms = property.rooms;
        entity.bathrooms = property.bathrooms;
        entity.address = property.address;
        entity.geoCoordinates = property.geoCoordinates;
        entity.neighborhood = property.neighborhood;
        entity.city = property.city;
        entity.year = property.year;
        entity.image = property.image;
        entity.contribution = property.contribution;
        entity.pinned = false;
        entity.approved = approved;
        return entity;
    }
}