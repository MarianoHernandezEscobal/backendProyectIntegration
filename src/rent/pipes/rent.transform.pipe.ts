import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { RentDTO } from '../dto/rent.dto';

@Injectable()
export class RentTransformPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'body' && value) {
      value = plainToClass(RentDTO, value);
    }
    return value;
  }
}