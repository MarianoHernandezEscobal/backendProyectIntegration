import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { User } from '../../user/dto/user.dto';
import { PropertyEntity } from '../property/property.entity';

@Injectable()
export class UsersDatabaseService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  create(user: User): Promise<UserEntity | null> {
    return this.usersRepository.save(user);
  }

  findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<UserEntity | null> {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['favoriteProperties'],
    });
  }

  findOneEmail(email: string): Promise<UserEntity | null> {
    return this.usersRepository.findOne({
      where: {
          email,
      },
  })
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async makeAdmin(user: UserEntity): Promise<UserEntity | null> {
    user.admin = true;
    return this.usersRepository.save(user);
  }

  async update(user: UserEntity, userUpdated: User): Promise<UserEntity | null> {
    const updatedProperty = this.usersRepository.merge(user, userUpdated);
    const updatedUser = await this.usersRepository.save(updatedProperty);
    return updatedUser;
  }

}