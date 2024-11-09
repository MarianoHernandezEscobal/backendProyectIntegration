import { Controller, Get, Post, Put, Body, Query, Req, UseGuards, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';
import { UserService } from './user.service';
import { User } from '@user/dto/user.dto';
import { AuthenticationResponseDto } from './dto/authentication.response.dto';
import { AuthenticationRequestDto } from './dto/authentication.request.dto';
import { UserResponseDto } from './dto/user.response.dto';
import { AuthGuard } from './guards/session.guard';
import { RequestWithUser } from './interfaces/request.interface';
import { RoleGuard } from './guards/admin.guard';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('status')
  @ApiOperation({ summary: 'Check the status of the service' })
  @ApiResponse({ status: 200, description: 'Service is OK', type: String })
  status(): string {
    return this.userService.status();
  }

  @Post('create')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: User })
  @ApiResponse({ status: 201, description: 'User created', type: AuthenticationResponseDto })
  @ApiResponse({ status: 400, description: 'Email already in use' })
  async create(@Body('user') user: User): Promise<AuthenticationResponseDto> {
    return await this.userService.create(user);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiBody({ type: AuthenticationRequestDto })
  @ApiResponse({ status: 200, description: 'Login successful', type: AuthenticationResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid credentials' })
  async login(@Body('user') user: AuthenticationRequestDto): Promise<AuthenticationResponseDto> {
    return await this.userService.login(user);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiResponse({ status: 200, description: 'User profile retrieved', type: UserResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async profile(@Req() request: RequestWithUser): Promise<UserResponseDto> {
    const email = request.user.email;
    return await this.userService.profile(email);
  }

  @Put('makeAdmin')
  @ApiOperation({ summary: 'Grant admin rights to a user' })
  @ApiQuery({ name: 'email', type: String })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @ApiResponse({ status: 200, description: 'User promoted to admin', type: UserResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async makeAdmin(@Query('email') email: string): Promise<UserResponseDto> {
    return await this.userService.makeAdmin(email);
  }

  @Put('changePassword')
  @ApiOperation({ summary: 'Change user password' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiBody({ schema: { properties: { currentPassword: { type: 'string' }, newPassword: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid current password' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async changePassword(
    @Body('currentPassword') currentPassword: string,
    @Body('newPassword') newPassword: string,
    @Req() request: RequestWithUser
  ): Promise<void> {
    const email = request.user.email;
    return await this.userService.changePassword(email, currentPassword, newPassword);
  }

  @Put('update') 
  @ApiOperation({ summary: 'Update user information' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiBody({ type: User })
  @ApiResponse({ status: 200, description: 'User updated', type: UserResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(@Body('user') user: User, @Req() request: RequestWithUser): Promise<UserResponseDto> {
    return await this.userService.update(user, request.user.email);
  }

  @Delete('delete')
  @ApiOperation({ summary: 'Delete user' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @ApiResponse({ status: 200, description: 'User deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async delete(@Query('email') email, @Req() request: RequestWithUser): Promise<void> {
    return await this.userService.delete(email, request.user.email);
  }
}
