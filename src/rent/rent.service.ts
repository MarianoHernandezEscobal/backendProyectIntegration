import { BadRequestException, HttpException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { UsersDatabaseService } from "@databaseUser/user.database.service";
import { PropertiesDatabaseService } from "@databaseProperties/property.database.service";
import { RentDTO } from "./dto/rent.dto";
import { RentsDatabaseService } from "@databaseRent/rent.database.service";
import { RentEntity } from "@databaseRent/rents.entity";
import { MESSAGES } from "@constants/messages";
import { PropertyStatus } from "../enums/status.enum";
import { User } from "@user/dto/user.dto";

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

  async create(rent: RentDTO, userAdmin: boolean): Promise<void> {
    try {

      if(rent.dateStart > rent.dateEnd) {
        throw new BadRequestException('Seleccione correctamente las fechas');
      }

        const user = await this.usersDatabaseService.findOne(rent.user.id);

        if (!user) {
          throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
        }

        const property = await this.propertiesDatabaseService.findOneByStatus(rent.property.id, PropertyStatus.ForRent);

        if (!property) {
          throw new NotFoundException(MESSAGES.PROPERTY_NOT_FOUND);
        }

        const existingRent = await this.rentsDatabaseService.findRentsInDateRange(rent.dateStart, rent.dateEnd, property);

        if(existingRent.length > 0) {
          throw new BadRequestException('Ya existe un alquiler en ese rango de fechas');
        }
        const entity = RentEntity.fromDto(rent, user, property, userAdmin);
        this.rentsDatabaseService.create(entity);

    } catch (e) {
        this.handleException(e, 'Error al alquilar');
    }
  }

  async getByUser(userId: number): Promise<RentEntity[]> {
    const user = await this.usersDatabaseService.findOne(userId);

    if (!user) {
      throw new Error(MESSAGES.USER_NOT_FOUND);
    }

    return await this.rentsDatabaseService.findByUser(user.id);
  }

  async getByProperty(propertyId: number): Promise<RentEntity[]> {
    const propertie = await this.propertiesDatabaseService.findOne(propertyId);

    if (!propertie) {
      throw new NotFoundException(MESSAGES.PROPERTY_NOT_FOUND);
    }

    return await this.rentsDatabaseService.findPropertyRents(propertie);
  }

  async findToApproved(): Promise<RentEntity[]> {
    return await this.rentsDatabaseService.findToApprove();
  }

  async approveRent(rentId: number): Promise<void> {
    const rent = await this.rentsDatabaseService.findOne(rentId);

    if (!rent) {
      throw new NotFoundException(MESSAGES.RENT_NOT_FOUND);
    }

    rent.approved = true;
    this.rentsDatabaseService.update(rent);
  }
}


