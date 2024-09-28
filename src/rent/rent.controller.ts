import { Controller, Post, Body, UsePipes, Param, Get } from '@nestjs/common';
import { RentService } from './rent.service';
import { RentDTO } from './dto/rent.dto';
import { RentTransformPipe } from './pipes/rent.transform.pipe';
import { RentEntity } from '@databaseRent/rents.entity';

@Controller('rent')
export class RentController {
  constructor(private readonly rentService: RentService) {}

  @Post('create')
  @UsePipes(new RentTransformPipe())
  async addFavorite(
    @Body('rent') rent: RentDTO,
  ): Promise<void> {
    return await this.rentService.create(rent);
  }

  @Get('user/:id')
  async getByUser(
    @Param('id') userId: number,
  ): Promise<RentEntity[]> {
    return await this.rentService.getByUser(userId);
  }
}
