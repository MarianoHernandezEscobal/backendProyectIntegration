import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropertyEntity } from './property.entity';
import { PropertyDto } from '@src/property/dto/property.dto';
import { PropertyStatus } from '@src/property/enums/status.enum';

@Injectable()
export class PropertiesDatabaseService {
  constructor(
    @InjectRepository(PropertyEntity, 'PROPERTY_CONNECTION')
    private propertyRepository: Repository<PropertyEntity>,
  ) {}

  create(property: PropertyEntity): Promise<PropertyEntity | null> {
    return this.propertyRepository.save(property);
  }

  findOne(id: number): Promise<PropertyEntity | null> {
    return this.propertyRepository.findOneBy({ id });
  }

  
  findTitle(title: string): Promise<PropertyEntity | null> {
    return this.propertyRepository.findOneBy({ title });
  }

  async update(property: PropertyEntity, updateDto: PropertyDto): Promise<PropertyEntity | null> {
    const updatedProperty = this.propertyRepository.merge(property, updateDto);
    const savedProperty = await this.propertyRepository.save(updatedProperty);
    return savedProperty;
  }

  findHome(): Promise<PropertyEntity[] | null> {
    return this.propertyRepository.find({
      order: {
        pinned: 'DESC',
        createdAt: 'DESC',
      },
    });
  }

  async remove(id: number): Promise<void> {
    await this.propertyRepository.delete(id);
  }

  async filterByStatus(status: PropertyStatus): Promise<PropertyEntity[]> {
    return this.propertyRepository
      .createQueryBuilder('property')
      .where('property.status LIKE :status', { status: `%${status}%` })
      .getMany();
  }
}