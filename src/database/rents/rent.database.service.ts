import { Injectable } from '@nestjs/common';
import { RentEntity } from './rents.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThan, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { PropertyEntity } from '../property/property.entity';

@Injectable()
export class RentsDatabaseService {
    constructor(
        @InjectRepository(RentEntity,)
        private rentRepository: Repository<RentEntity>,
      ) {}

    create(rent: RentEntity): Promise<RentEntity | null> {
        return this.rentRepository.save(rent);
    }

    findByUser(userId: number): Promise<RentEntity[]> {
        return this.rentRepository.find({
            where: { user: { id: userId } },
            relations: ['property'],
        });
    }

    findRentsInDateRange(dateStart: Date, dateEnd: Date, property: PropertyEntity): Promise<RentEntity[]> {
        return this.rentRepository.find({
            where: {
                property: { id: property.id },
                dateStart: LessThanOrEqual(dateEnd),
                dateEnd: MoreThanOrEqual(dateStart),
            },
        });
    }

    findPropertyRents(property: PropertyEntity): Promise<RentEntity[]> {
        return this.rentRepository.find({
            where: { property },
        });
    }

    async findToApprove(): Promise<RentEntity[]> {
        return this.rentRepository.find({ where: { approved: false } });
    }

    async update(rent: RentEntity): Promise<RentEntity | null> {
        const updatedRent = await this.rentRepository.save(rent);
        return updatedRent;
    }

    async remove(id: number): Promise<void> {
        await this.rentRepository.delete(id);
    }

    async filterByStatus(approved: boolean, page:number): Promise<RentEntity[]> {
        return this.rentRepository.find({
            where: { approved },
            order: { createdAt: 'DESC' },
            skip: (page - 1) * +process.env.PAGE_SIZE,
            take: +process.env.PAGE_SIZE,
        });
    }


}