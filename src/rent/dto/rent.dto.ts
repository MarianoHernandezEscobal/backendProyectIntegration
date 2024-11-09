import { IsDate } from 'class-validator';
import { Transform } from 'class-transformer';
import { UserEntity } from '@database/user/user.entity';
import { PropertyEntity } from '@database/property/property.entity';


export class RentDTO {
    @Transform(({ value }) => {
        const [year, month, day] = value.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        date.setHours(15, 0, 0, 0);
        return date;
      })
    @IsDate()
    dateStart: Date;
  
    @Transform(({ value }) => {
        const [year, month, day] = value.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        date.setHours(10, 0, 0, 0);
        return date;
      })
    @IsDate()
    dateEnd: Date;

    user: UserEntity;
    property: PropertyEntity;
}