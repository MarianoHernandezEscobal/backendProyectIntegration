import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyEntity } from '@databaseProperties/property.entity';
import { UserEntity } from '@databaseUser/user.entity';
import { FavoritesController } from './favorite.controller';
import { DatabaseModule } from '@src/database/database.module';
import { FavoritesService } from './favorites.service';


@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([UserEntity, PropertyEntity]),
  ],
  providers: [FavoritesService],
  controllers: [FavoritesController],
})
export class FavoritesModule {}


// import { Module } from '@nestjs/common';
// import { PropertyController } from './property.controller';
// import { PropertyService } from './property.service';
// import { DatabaseModule } from '@src/database/database.module';

// @Module({
//   imports: [DatabaseModule],
//   controllers: [PropertyController],
//   providers: [PropertyService],
// })
// export class PropertyModule {}