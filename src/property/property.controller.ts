import { Body, Controller, Get, Post, Query, UsePipes, ValidationPipe, } from '@nestjs/common';
import { PropertyService } from './property.service';
import { PropertyDto } from './dto/property.dto';
import { PropertyPlpDto } from './dto/property.plp.dto';

@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post('create')
  async create(
    @Body('property') property: PropertyDto
  ): Promise<PropertyDto> {
    return await this.propertyService.create(property);
  }

  @Post('update')
  async update(
    @Body('property') property: PropertyDto
  ): Promise<PropertyDto> {
    return await this.propertyService.update(property);
  }

  @Get('findOne')
  async findOne(
    @Query('id') id: string
  ): Promise<PropertyDto> {
    return await this.propertyService.findOne(+id);
  }

  @Get('home')
  async home(): Promise<PropertyPlpDto[]> {
    return await this.propertyService.home();
  }

  @Get('filterStatus')
  async filterStatus(
    @Query('status') status: string
  ): Promise<PropertyPlpDto[]> {
    return await this.propertyService.filterStatus(status);
  }

}
