import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/user.entity';
import { UsersDatabaseService } from './user/user.database.service';
import { PropertyEntity } from './property/property.entity';
import { PropertiesDatabaseService } from './property/property.database.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: 'USER_CONNECTION',
      useFactory: () => ({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME_USERS,
        entities: [UserEntity],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forRootAsync({
      name: 'PROPERTY_CONNECTION',
      useFactory: () => ({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME_PROPERTY,
        entities: [PropertyEntity],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([UserEntity], 'USER_CONNECTION'),
    TypeOrmModule.forFeature([PropertyEntity], 'PROPERTY_CONNECTION'),
  ],
  providers: [UsersDatabaseService, PropertiesDatabaseService],
  exports: [TypeOrmModule, UsersDatabaseService, PropertiesDatabaseService],
})
export class DatabaseModule {}
