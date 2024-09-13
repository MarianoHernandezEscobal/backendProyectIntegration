import { Controller, Post, Delete, Get, Param, Query } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { PropertyEntity } from '@databaseProperties/property.entity';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post('add')
  async addFavorite(
    @Query('userId') userId: number,
    @Query('propertyId') propertyId: number,
  ): Promise<void> {
    return await this.favoritesService.addFavorite(userId, propertyId);
  }

  @Delete('delete')
  async removeFavorite(
    @Query('userId') userId: number,
    @Query('propertyId') propertyId: number,
  ): Promise<PropertyEntity[]> {
    return await this.favoritesService.removeFavorite(+userId, +propertyId);
  }

  @Get('get')
  async getFavorites(@Query('userId') userId: number): Promise<PropertyEntity[]> {
    return await this.favoritesService.getFavorites(userId);
  }
}
