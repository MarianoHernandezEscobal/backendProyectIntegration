import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { PropertyEntity } from './property.entity';
import { PropertyDto } from '@src/property/dto/property.dto';
import { PropertyStatus } from '@src/enums/status.enum';
import { ConfigService } from '@nestjs/config';
import { User } from '@src/user/dto/user.dto';

@Injectable()
export class PropertiesDatabaseService {
  constructor(
    @InjectRepository(PropertyEntity,)
    private propertyRepository: Repository<PropertyEntity>,
    private readonly configService: ConfigService,
  ) {}

  create(property: PropertyEntity): Promise<PropertyEntity | null> {
    return this.propertyRepository.save(property);
  }

  findOne(id: number, relations?: string[]): Promise<PropertyEntity | null> {
    const options: FindOneOptions<PropertyEntity> = {
      where: { id },
    };

    if (relations && relations.length > 0) {
      options.relations = relations;
    }

    return this.propertyRepository.findOne(options);
  }

  findOneByStatus(id: number, status: PropertyStatus): Promise<PropertyEntity | null> {
    return this.propertyRepository.findOne({
      where: { id, status },
    });
  }

  
  findTitle(title: string): Promise<PropertyEntity | null> {
    return this.propertyRepository.findOneBy({ title });
  }

  async findToApprove(): Promise<PropertyEntity[]> {
    return this.propertyRepository.find({ where: { approved: false } });
  }

  async update(property: PropertyEntity, updateDto: PropertyEntity): Promise<PropertyEntity | null> {
    const updatedProperty = this.propertyRepository.merge(property, updateDto);
    const savedProperty = await this.propertyRepository.save(updatedProperty);
    return savedProperty;
  }

  async findHome(status: PropertyStatus): Promise<PropertyEntity[]> {
    return this.propertyRepository.find({
      where: { status, pinned: false, approved: true },
      order: { createdAt: 'DESC' },
    });
  }

  async remove(id: number): Promise<void> {
    await this.propertyRepository.delete(id);
  }

  async filterByStatus(status: PropertyStatus, page:number): Promise<PropertyEntity[]> {
    const pageSize = +this.configService.get<string>('PAGE_SIZE')
    return this.propertyRepository.find({
      where: { status, approved: true },
      order: { pinned: 'DESC',createdAt: 'DESC' },
      skip: (page - 1) * + pageSize,
      take: pageSize,
    });
  }

  async findPinned(): Promise<PropertyEntity[]> {
    return this.propertyRepository.find({ where: { pinned: true, approved: true } });
  }

  async findCreatedProperties(userId: number): Promise<PropertyEntity[]> {
    return this.propertyRepository.find({ where: { createdBy: { id: userId } } });
  }

  async findAll(): Promise<PropertyEntity[]> {
    return this.propertyRepository.find();
  }
}