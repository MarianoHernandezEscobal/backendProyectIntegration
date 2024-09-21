import { Module } from '@nestjs/common';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';
import { DatabaseModule } from '@src/database/database.module';
import { ClientsModule } from '@src/clients/clients.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [DatabaseModule, ClientsModule,  ScheduleModule.forRoot(),],
  controllers: [PropertyController],
  providers: [PropertyService],
})
export class PropertyModule {}