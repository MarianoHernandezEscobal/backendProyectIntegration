import { BadRequestException, HttpException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { UsersDatabaseService } from "@databaseUser/user.database.service";
import { PropertiesDatabaseService } from "@databaseProperties/property.database.service";
import { PropertyEntity } from "@databaseProperties/property.entity";
import { FavoritesDatabaseService } from "@src/database/favorite/favorite.database.service";

@Injectable()
export class FavoritesService {
  constructor(
    private readonly usersDatabaseService: UsersDatabaseService,
    private readonly propertiesDatabaseService: PropertiesDatabaseService,
    private readonly favoritesDatabaseService: FavoritesDatabaseService,
  ) {}

  private handleException(e: any, message: string): void {
    if (e instanceof BadRequestException || e instanceof NotFoundException || e instanceof UnauthorizedException) {
      throw e;
    }
    console.error(e);
    throw new HttpException(message, 500);
  }

  async addFavorite(userId: number, propertyId: number): Promise<void> {
    try {
        const user = await this.usersDatabaseService.findOne(userId);

        if (!user) {
        throw new NotFoundException('Usuario no encontrado');
        }

        const property = await this.propertiesDatabaseService.findOne(propertyId);

        if (!property) {
        throw new Error('Propiedad no encontrada');
        }

        if (user.favoriteProperties.find((fav) => fav.id === propertyId)) {
            return;
        }
        await this.favoritesDatabaseService.addFavoriteProperty(user, property);
    } catch (e) {
        this.handleException(e, 'Error al añadir a favoritos');
    }
  }

  async removeFavorite(userId: number, propertyId: number): Promise<PropertyEntity[]> {
    const user = await this.usersDatabaseService.findOne(userId);

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    await this.favoritesDatabaseService.removeFavorite(user, propertyId);
    return user.favoriteProperties || [];
  }

  async getFavorites(userId: number): Promise<PropertyEntity[]> {
    const favoriteProperties = await this.favoritesDatabaseService.getFavorites(userId);

    return favoriteProperties || [];
  }
}


