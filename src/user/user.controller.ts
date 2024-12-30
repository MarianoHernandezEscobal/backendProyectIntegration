import { Controller, Get, Post, Put, Body, Query, Req, UseGuards, Delete, UsePipes, ValidationPipe, Res, } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@user/dto/user.dto';
import { AuthenticationResponseDto } from './dto/authentication.response.dto';
import { AuthenticationRequestDto } from './dto/authentication.request.dto';
import { UserResponseDto } from './dto/user.response.dto';
import { AuthGuard } from './guards/session.guard';
import { RequestWithUser } from './interfaces/request.interface';
import { RoleGuard } from './guards/admin.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import {  FastifyReply } from 'fastify'; // FastifyReply es el tipo de respuesta de Fastify 
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
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: User })
  @ApiResponse({ status: 201, description: 'User created', type: AuthenticationResponseDto })
  @ApiResponse({ status: 400, description: 'Email already in use' })
  async create(
    @Body('user') user: User,
    @Res() response: FastifyReply
    ): Promise<AuthenticationResponseDto> {
    const token = await this.userService.create(user);
    response.setCookie('session', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    });
    return response.status(200).send('Creado correctamente'); 
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) reply: FastifyReply): Promise<{ message: string }> {
    reply.clearCookie('session', { path: '/' });
    return { message: 'Logout exitoso' };
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Login a user' })
  @ApiBody({ type: AuthenticationRequestDto })
  @ApiResponse({ status: 200, description: 'Login successful', type: AuthenticationResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid credentials' })
  async login(
    @Body('user') user: AuthenticationRequestDto,
    @Res() response: FastifyReply
    ): Promise<AuthenticationResponseDto> {
    const token = await this.userService.login(user);
    response.setCookie('session', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    });
    return response.status(200).send('Inicio de session correcto'); 
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
  async update(
    @Body('user') user: User,
    @Req() request: RequestWithUser,
    @Res() response: FastifyReply
  ): Promise<UserResponseDto> {
    const updated =  await this.userService.update(user, request.user.email);
    response.setCookie('session', updated, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    });
    return response.status(200).send('Actualizacion correcta'); 
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
