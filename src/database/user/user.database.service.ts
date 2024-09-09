import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { User } from '../../user/dto/user.dto';

@Injectable()
export class UsersDatabaseService {
  constructor(
    @InjectRepository(UserEntity, 'USER_CONNECTION')
    private usersRepository: Repository<UserEntity>,
  ) {}

  create(user: User): Promise<UserEntity | null> {
    return this.usersRepository.save(user);
  }

  findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<UserEntity | null> {
    return this.usersRepository.findOneBy({ id });
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
}