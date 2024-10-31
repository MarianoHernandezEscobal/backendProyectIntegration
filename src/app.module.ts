import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config/validateSchema.env';
import { UserModule } from './user/user.module';
import { PropertyModule } from './property/property.module';
import { FavoritesModule } from './favorite/favorite.module';
import { RentModule } from './rent/rent.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema,
    }),
    PropertyModule,
    UserModule,
    FavoritesModule,
    RentModule,
  ],
})
export class AppModule {}
