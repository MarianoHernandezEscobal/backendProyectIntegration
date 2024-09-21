import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropertyEntity } from './property.entity';
import { PropertyDto } from '@src/property/dto/property.dto';
import { PropertyStatus } from '@src/property/enums/status.enum';

@Injectable()
export class PropertiesDatabaseService {
  constructor(
    @InjectRepository(PropertyEntity,)
    private propertyRepository: Repository<PropertyEntity>,
  ) {}

  create(property: PropertyEntity): Promise<PropertyEntity | null> {
    return this.propertyRepository.save(property);
  }

  findOne(id: number): Promise<PropertyEntity | null> {
    return this.propertyRepository.findOne({
      where: { id },
      relations: ['users'],
    });
  }

  
  findTitle(title: string): Promise<PropertyEntity | null> {
    return this.propertyRepository.findOneBy({ title });
  }

  async findToApprove(): Promise<PropertyEntity[]> {
    return this.propertyRepository.find({ where: { approved: false } });
  }

  async update(property: PropertyEntity, updateDto: PropertyDto): Promise<PropertyEntity | null> {
    const updatedProperty = this.propertyRepository.merge(property, updateDto);
    const savedProperty = await this.propertyRepository.save(updatedProperty);
    return savedProperty;
  }

  async findHome(status: PropertyStatus): Promise<PropertyEntity[]> {
    return this.propertyRepository.find({
      where: { status, pinned: false, approved: true },
      order: { createdAt: 'DESC' },
      take: 12,
    });
  }

  async remove(id: number): Promise<void> {
    await this.propertyRepository.delete(id);
  }

  async filterByStatus(status: PropertyStatus, page:number): Promise<PropertyEntity[]> {
    return this.propertyRepository.find({
      where: { status, approved: true },
      order: { pinned: 'DESC',createdAt: 'DESC' },
      skip: (page - 1) * +process.env.PAGE_SIZE,
      take: +process.env.PAGE_SIZE,
    });
  }

  async findPinned(): Promise<PropertyEntity[]> {
    return this.propertyRepository.find({ where: { pinned: true, approved: true } });
  }
}