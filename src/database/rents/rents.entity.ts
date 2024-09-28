import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { RentDTO } from '@src/rent/dto/rent.dto';
import { UserEntity } from '../user/user.entity';
import { PropertyEntity } from '../property/property.entity';
import dayjs from 'dayjs';

@Entity()
export class RentEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'datetime' })
    dateStart: Date;

    @Column({ type: 'datetime' })
    dateEnd: Date;

    @Column()
    price: number;

    @CreateDateColumn()
    createdAt: Date;

    @Column()
    approved: boolean;

    @ManyToOne('UserEntity', 'rents')
    user: UserEntity;
  
    @ManyToOne('PropertyEntity', 'rents')
    property: PropertyEntity;


    static fromDto(rent: RentDTO, user: UserEntity, property: PropertyEntity): RentEntity {
        const entity = new RentEntity();
        entity.dateStart = rent.dateStart;
        entity.dateEnd = rent.dateEnd;
        entity.price = property.price * (entity.dateEnd.getDate() - entity.dateStart.getDate());
        entity.approved = user.admin;
        entity.user = user;
        entity.property = property;
        return entity;
    }
}