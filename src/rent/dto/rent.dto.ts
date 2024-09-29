import { IsDate } from 'class-validator';
import { Transform } from 'class-transformer';


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

    user: number;
    property: number;
}