import { Injectable, BadRequestException, HttpException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from './dto/user.dto';
import { AuthenticationResponseDto } from './dto/authentication.response.dto';
import { UserResponseDto } from './dto/user.response.dto';
import { UsersDatabaseService } from '@src/database/user/user.database.service';
import { AuthenticationRequestDto } from './dto/authentication.request.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly usersDatabaseService: UsersDatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  status(): string {
    return 'ok';
  }

  private async findUserByEmailOrThrow(email: string): Promise<User> {
    const user = await this.usersDatabaseService.findOneEmail(email);
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }
    return user;
  }

  private handleException(error: any, defaultMessage: string): void {
    if (error instanceof BadRequestException) {
      throw error;
    }
    console.error(error);
    throw new HttpException(defaultMessage, 500);
  }

  async create(create: User): Promise<AuthenticationResponseDto> {
    try {
      const existingUser = await this.usersDatabaseService.findOneEmail(create.email);
      if (existingUser) {
        throw new BadRequestException('Email ya está en uso');
      }

      create.password = await this.hashPassword(create.password);
      const savedUser = await this.usersDatabaseService.create(create);
      const jwt = await this.generateJwt(savedUser);

      return { access_token: jwt };
    } catch (e) {
      this.handleException(e, 'Error al crear el usuario');
    }
  }

  async login(user: AuthenticationRequestDto): Promise<AuthenticationResponseDto> {
    try {
      const existingUser = await this.findUserByEmailOrThrow(user.email);
      const isPasswordValid = await bcrypt.compare(user.password, existingUser.password);
      if (!isPasswordValid) {
        throw new BadRequestException('Contraseña incorrecta');
      }

      const jwt = await this.generateJwt(existingUser);
      return { access_token: jwt };
    } catch (e) {
      this.handleException(e, 'Error al iniciar sesión');
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
      user.admin = true;
      await this.usersDatabaseService.create(user);

      return new UserResponseDto(user);
    } catch (e) {
      this.handleException(e, 'Error al hacer administrador al usuario');
    }
  }

  private async generateJwt(user: UserResponseDto): Promise<string> {
    const payload = { user };
    const token = await this.jwtService.signAsync(payload);
    return `Bearer ${token}`;
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = +process.env.SALT || 10;
    return bcrypt.hash(password, saltRounds);
  }
}
