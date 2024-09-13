import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/user.entity';
import { UsersDatabaseService } from './user/user.database.service';
import { PropertyEntity } from './property/property.entity';
import { PropertiesDatabaseService } from './property/property.database.service';
import { FavoritesDatabaseService } from './favorite/favorite.database.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [UserEntity, PropertyEntity],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([UserEntity, PropertyEntity]),
  ],
  providers: [UsersDatabaseService, PropertiesDatabaseService, FavoritesDatabaseService],
  exports: [UsersDatabaseService, PropertiesDatabaseService, FavoritesDatabaseService],
})
export class DatabaseModule {}
