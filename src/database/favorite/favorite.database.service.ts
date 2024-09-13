import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { PropertyEntity } from '../property/property.entity';

@Injectable()
export class FavoritesDatabaseService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    @InjectRepository(PropertyEntity)
    private propertyRepository: Repository<PropertyEntity>,
  ) {}

  async addFavorite(userId: number, propertyId: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favoriteProperties'],
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const property = await this.propertyRepository.findOne({ where: { id: propertyId } });

    if (!property) {
      throw new Error('Propiedad no encontrada');
    }

    if (user.favoriteProperties.find((fav) => fav.id === propertyId)) {
      return;
    }

    user.favoriteProperties.push(property);
    await this.userRepository.save(user);
  }

  async removeFavorite(userId: number, propertyId: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favoriteProperties'],
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    user.favoriteProperties = user.favoriteProperties.filter((fav) => fav.id !== propertyId);
    await this.userRepository.save(user); // Guardar los cambios
  }

  async getFavorites(userId: number): Promise<PropertyEntity[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favoriteProperties'],
    });

    return user.favoriteProperties || [];
  }
}
