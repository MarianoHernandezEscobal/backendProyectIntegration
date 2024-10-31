import { Controller, Post, Body, UsePipes, Param, Get, UseGuards, Req } from '@nestjs/common';
import { RentService } from './rent.service';
import { RentDTO } from './dto/rent.dto';
import { RentTransformPipe } from './pipes/rent.transform.pipe';
import { RentEntity } from '@databaseRent/rents.entity';
import { AuthGuard } from '@user/guards/session.guard';
import { RequestWithUser } from '@user/interfaces/request.interface';

@Controller('rent')
export class RentController {
  constructor(private readonly rentService: RentService) {}

  @Post('create')
  @UsePipes(new RentTransformPipe())
  @UseGuards(AuthGuard)
  async addFavorite(
    @Body('rent') rent: RentDTO,
    @Req() request: RequestWithUser
  ): Promise<void> {
    return await this.rentService.create(rent, request.user.admin);
  }

  @Get('user/:id')
  async getByUser(
    @Param('id') userId: number,
  ): Promise<RentEntity[]> {
    return await this.rentService.getByUser(userId);
  }

  @Get('property/:id')
  async getByProperty(
    @Param('id') propertyId: number,
  ): Promise<RentEntity[]> {
    return await this.rentService.getByProperty(propertyId);
  }

  @Get('findToApproved')
  async findToApproved(
  ): Promise<RentEntity[]> {
    return await this.rentService.findToApproved();
  }

  @Get('approved')
  async approveRent(
  ): Promise<RentEntity[]> {
    return await this.rentService.findToApproved();
  }
}
