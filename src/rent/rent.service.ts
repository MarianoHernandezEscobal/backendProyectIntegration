import { BadRequestException, HttpException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { UsersDatabaseService } from "@databaseUser/user.database.service";
import { PropertiesDatabaseService } from "@databaseProperties/property.database.service";
import { RentDTO } from "./dto/rent.dto";
import { RentsDatabaseService } from "@databaseRent/rent.database.service";
import { RentEntity } from "@databaseRent/rents.entity";
import { MESSAGES } from "@constants/messages";

@Injectable()
export class RentService {
  constructor(
    private readonly usersDatabaseService: UsersDatabaseService,
    private readonly propertiesDatabaseService: PropertiesDatabaseService,
    private readonly rentsDatabaseService: RentsDatabaseService,
  ) {}

  private handleException(e: any, message: string): void {
    if (e instanceof BadRequestException || e instanceof NotFoundException || e instanceof UnauthorizedException) {
      throw e;
    }
    console.error(e);
    throw new HttpException(message, 500);
  }

  async create(rent: RentDTO): Promise<void> {
    try {

      if(rent.dateStart > rent.dateEnd) {
        throw new BadRequestException('Seleccione correctamente las fechas');
      }

        const user = await this.usersDatabaseService.findOne(rent.user);

        if (!user) {
          throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
        }

        const property = await this.propertiesDatabaseService.findOne(rent.property);

        if (!property) {
          throw new Error(MESSAGES.PROPERTY_NOT_FOUND);
        }

        const existingRent = await this.rentsDatabaseService.findRentsInDateRange(rent.dateStart, rent.dateEnd, property);

        if(existingRent.length > 0) {
          throw new BadRequestException('Ya existe un alquiler en ese rango de fechas');
        }
        
        const entity = RentEntity.fromDto(rent, user, property);
        this.rentsDatabaseService.create(entity);

    } catch (e) {
        this.handleException(e, 'Error al alquilar');
    }
  }

  async getByUser(userId: number): Promise<RentEntity[]> {
    const user = await this.usersDatabaseService.findOne(userId);

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return await this.rentsDatabaseService.findByUser(user.id);
  }
}


