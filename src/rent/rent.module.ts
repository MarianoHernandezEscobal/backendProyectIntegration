import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyEntity } from '@databaseProperties/property.entity';
import { UserEntity } from '@databaseUser/user.entity';
import { RentController } from './rent.controller';
import { DatabaseModule } from '@src/database/database.module';
import { RentService } from './rent.service';
import { RentEntity } from '@src/database/rents/rents.entity';


@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([UserEntity, PropertyEntity, RentEntity]),
  ],
  providers: [RentService],
  controllers: [RentController],
})
export class RentModule {}
