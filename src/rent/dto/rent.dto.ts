import { IsDate } from 'class-validator';
import { Transform } from 'class-transformer';


export class RentDTO {
    @Transform(({ value }) => {
        const date = new Date(value);
        date.setHours(14, 0, 0, 0);
        return date;
      })
    @IsDate()
    dateStart: Date;
  
    @Transform(({ value }) => {
        const date = new Date(value);
        date.setHours(10, 0, 0, 0);
        return date;
      })
    @IsDate()
    dateEnd: Date;

    user: number;
    property: number;
}