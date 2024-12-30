import { Injectable, BadRequestException, HttpException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from './dto/user.dto';
import { AuthenticationResponseDto } from './dto/authentication.response.dto';
import { UserResponseDto } from './dto/user.response.dto';
import { UsersDatabaseService } from '@src/database/user/user.database.service';
import { AuthenticationRequestDto } from './dto/authentication.request.dto';
import { MESSAGES } from '@constants/messages';
import { UserEntity } from '@src/database/user/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    private readonly usersDatabaseService: UsersDatabaseService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  status(): string {
    return 'ok';
  }

  private async findUserByEmailOrThrow(email: string, relations?: string[]): Promise<UserEntity> {
    const user = await this.usersDatabaseService.findOneEmail(email, relations);
    if (!user) {
      throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
    }
    return user;
  }

  private handleException(error: any, defaultMessage: string): void {
    if (error instanceof BadRequestException || error instanceof NotFoundException || error instanceof UnauthorizedException) {
      throw error;
    }
    console.error(error);
    throw new HttpException(defaultMessage, 500);
  }

  async create(create: User): Promise<string> {
    try {
      const existingUser = await this.usersDatabaseService.findOneEmail(create.email);
      if (existingUser) {
        throw new BadRequestException('Email ya está en uso');
      }
      create.phone = User.formatPhoneNumber(create.phone);
      create.password = await this.hashPassword(create.password);
      const savedUser = await this.usersDatabaseService.create(create);
      const jwt = await this.generateJwt(savedUser);

      return jwt ;
    } catch (e) {
      this.handleException(e, 'Error al crear el usuario');
    }
  }

  async login(user: AuthenticationRequestDto): Promise<string> {
    try {
      const existingUser = await this.findUserByEmailOrThrow(user.email);
      const isPasswordValid = await bcrypt.compare(user.password, existingUser.password);
      if (!isPasswordValid) {
        throw new BadRequestException('Contraseña incorrecta');
      }
      const jwt = await this.generateJwt(existingUser);

      return  jwt;
    } catch (e) {
      this.handleException(new UnauthorizedException(), 'Error al iniciar sesión');
    }
  }

  async profile(email: string): Promise<UserResponseDto> {
    try {
      const user = await this.findUserByEmailOrThrow(email);
      return new UserResponseDto(user);
    } catch (e) {
      this.handleException(e, 'Error al buscar el usuario');
    }
  }

  async makeAdmin(email: string): Promise<UserResponseDto> {
    try {
      const user = await this.findUserByEmailOrThrow(email);
      await this.usersDatabaseService.makeAdmin(user);
      return new UserResponseDto(user);
    } catch (e) {
      this.handleException(e, 'Error al hacer administrador al usuario');
    }
  }

  async update(update: User, email: string): Promise<string> {
    try {
      const user = await this.findUserByEmailOrThrow(email);
      update.phone = update ? User.formatPhoneNumber(update.phone) : user.phone;
      if (update.password) {
        update.password = await this.hashPassword(update.password);
      }
      const updatedUser = await this.usersDatabaseService.update(user, update);
      return this.generateJwt(updatedUser);
    } catch (e) {
      this.handleException(e, 'Error al actualizar el usuario');
    }
  }

  async changePassword(email: string, currentPassword: string, newPassword: string): Promise<void> {
    try {
      const user = await this.findUserByEmailOrThrow(email);

      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        throw new BadRequestException('Contraseña actual incorrecta');
      }

      const hashedPassword = await this.hashPassword(newPassword);

      const updatedUser: User = {
        ...user,
        password: hashedPassword,
      };
      await this.usersDatabaseService.update(user, updatedUser);
    } catch (e) {
      this.handleException(e, 'Error al cambiar la contraseña');
    }
  }

  async delete(email: string, userEmail: string): Promise<void> {
    try {
      const emailToDelete = email || userEmail;
      const user = await this.findUserByEmailOrThrow(emailToDelete);
      await this.usersDatabaseService.remove(user.id);
    } catch (e) {
      this.handleException(e, 'Error al eliminar el usuario');
    }
  }

  private async generateJwt(user: UserEntity): Promise<string> {
    const payload = { id: user.id, email: user.email, admin: user.admin };
    const token = await this.jwtService.signAsync(payload);
    return `Bearer ${token}`;
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = +this.configService.get<string>('SALT') || 10;
    return bcrypt.hash(password, saltRounds);
  }
}
