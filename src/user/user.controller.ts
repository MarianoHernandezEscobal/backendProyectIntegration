import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@src/user/dto/user.dto';
import { AuthenticationResponseDto } from './dto/authentication.response.dto';
import { AuthenticationRequestDto } from './dto/authentication.request.dto';
import { UserResponseDto } from './dto/user.response.dto';
import { AuthGuard } from './guards/session.guard';
import { RequestWithUser } from './interfaces/request.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async create(
    @Body('user') user: User
  ): Promise<AuthenticationResponseDto> {
    return await this.userService.create(user);
  }

  @Post('login')
  async login(
    @Body('user') user: AuthenticationRequestDto
  ): Promise<AuthenticationResponseDto> {
    return await this.userService.login(user);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  async profile(
    @Req() request: RequestWithUser
  ): Promise<UserResponseDto> {
    const email = request.user.email;
    return await this.userService.profile(email);
  }
}
