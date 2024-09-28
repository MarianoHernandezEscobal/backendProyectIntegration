import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PropertyModule } from './property/property.module';
import { FavoritesModule } from './favorite/favorite.module';
import { RentModule } from './rent/rent.module';

@Module({
  imports: [PropertyModule, UserModule, FavoritesModule, RentModule],
})
export class AppModule {}
