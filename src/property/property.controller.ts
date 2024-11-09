import { BadRequestException, Body, Controller, Get, HttpException, NotFoundException, Post, Query, Req, UnauthorizedException, UseGuards, } from '@nestjs/common';
import { PropertyService } from './property.service';
import { PropertyDto } from './dto/property.dto';
import { Home } from './dto/home.response.dto';
import { AuthGuard } from '@src/user/guards/session.guard';
import { RequestWithUser } from '@user/interfaces/request.interface';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TokenGuard } from './guards/token.guard';

@ApiTags('Properties')
@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post('create')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Crear una nueva propiedad' })
  @ApiBearerAuth()
  @ApiBody({ description: 'Datos de la nueva propiedad', type: PropertyDto })
  @ApiResponse({ status: 201, description: 'Propiedad creada exitosamente', type: PropertyDto })
  @ApiResponse({ status: 400, description: 'Propiedad ya existente o datos inválidos' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor', type: HttpException })
  async create(
    @Body('property') property: PropertyDto,
    @Req() request: RequestWithUser
  ): Promise<PropertyDto> {
    return await this.propertyService.create(property, request.user);
  }

  @Post('update')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Actualizar una propiedad existente' })
  @ApiBearerAuth()
  @ApiBody({ description: 'Datos de la propiedad para actualizar', type: PropertyDto })
  @ApiResponse({ status: 200, description: 'Propiedad actualizada exitosamente', type: PropertyDto })
  @ApiResponse({ status: 401, description: 'No autorizado (Token faltante o inválido)', type: UnauthorizedException })
  @ApiResponse({ status: 404, description: 'Propiedad no encontrada', type: NotFoundException })
  @ApiResponse({ status: 500, description: 'Error interno del servidor', type: HttpException })
  async update(
    @Body('property') property: PropertyDto,
    @Req() request: RequestWithUser
  ): Promise<PropertyDto> {
    return await this.propertyService.update(property, request.user);
  }

    @Get('findOne')
    @ApiOperation({ summary: 'Encuentra una propiedad por ID' })
    @ApiQuery({ name: 'id', type: 'string', description: 'ID de la propiedad a buscar' })
    @ApiResponse({ status: 200, description: 'Propiedad encontrada', type: PropertyDto })
    @ApiResponse({ status: 404, description: 'Propiedad no encontrada', type: NotFoundException })
    @ApiResponse({ status: 500, description: 'Error interno del servidor', type: HttpException })
    async findOne(
      @Query('id') id: string
    ): Promise<PropertyDto> {
      return await this.propertyService.findOne(id);
    }
  

  @Get('home')
  @UseGuards(TokenGuard)
  @ApiOperation({ summary: 'Obtener las propiedades para el home' })
  @ApiResponse({ status: 200, description: 'Propiedades obtenidas correctamente', type: Home })
  @ApiResponse({ status: 404, description: 'Propiedades no encontradas', type: NotFoundException })
  @ApiResponse({ status: 500, description: 'Error interno del servidor', type: HttpException })
  async home(@Req() request: RequestWithUser): Promise<Home> {
    return await this.propertyService.home(request.user);
  }

  @Get('filterStatus')
  @ApiOperation({ summary: 'Filtrar propiedades por estado' })
  @ApiQuery({ name: 'status', type: 'string', description: 'El estado de la propiedad (ForRent, ForSale, etc.)' })
  @ApiQuery({ name: 'page', type: 'number', description: 'Número de página para la paginación' })
  @ApiResponse({ status: 200, description: 'Propiedades filtradas correctamente', type: [PropertyDto] })
  @ApiResponse({ status: 400, description: 'Tipo de propiedad inválido', type: BadRequestException })
  @ApiResponse({ status: 404, description: 'Propiedades no encontradas', type: NotFoundException })
  @ApiResponse({ status: 500, description: 'Error interno del servidor', type: HttpException })
  async filterStatus(
    @Query('status') status: string,
    @Query('page') page: number
  ): Promise<PropertyDto[]> {
    return await this.propertyService.filterStatus(status, page);
  }

  @Get('findToApproved')
  @ApiOperation({ summary: 'Obtener propiedades pendientes de aprobación' })
  @ApiResponse({ status: 200, description: 'Propiedades encontradas para aprobar', type: [PropertyDto] })
  @ApiResponse({ status: 404, description: 'No se encontraron propiedades para aprobar', type: NotFoundException })
  @ApiResponse({ status: 500, description: 'Error interno del servidor',  type: HttpException })
  async filterToApproved(
  ): Promise<PropertyDto[]> {
    return await this.propertyService.findToApprove();
  }

  @Get('findAll')
  @ApiOperation({ summary: 'Obtener todas las propiedades' })
  @ApiResponse({ status: 200, description: 'Propiedades encontradas', type: [PropertyDto] })
  @ApiResponse({ status: 404, description: 'No se encontraron propiedades', type: NotFoundException })
  @ApiResponse({ status: 500, description: 'Error interno del servidor', type: HttpException })
  async findAll(): Promise<PropertyDto[]> {
    return await this.propertyService.findAll();
  }

  @Get('createdProperties')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener propiedades creadas por el usuario' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Propiedades encontradas', type: [PropertyDto] })
  @ApiResponse({ status: 404, description: 'No se encontraron propiedades', type: NotFoundException })
  @ApiResponse({ status: 500, description: 'Error interno del servidor', type: HttpException })
  async createdProperties(
    @Req() request: RequestWithUser
  ): Promise<PropertyDto[]> {
    return await this.propertyService.getCreatedProperties(request.user);
  }

  @Get('testTokens')
  async testTokens() {
    await this.propertyService.renewFacebookTokens();
  }
}
