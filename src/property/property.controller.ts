import { 
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  NotFoundException,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UploadedFiles,
  UseGuards, 
  UseInterceptors} from '@nestjs/common';
import { PropertyService } from './property.service';
import { PropertyDto } from './dto/property.dto';
import { Home } from './dto/home.response.dto';
import { AuthGuard } from '@src/user/guards/session.guard';
import { RequestWithUser } from '@user/interfaces/request.interface';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags, ApiConsumes } from '@nestjs/swagger';
import { TokenGuard } from './guards/token.guard';
import { FilesInterceptor, File } from '@nest-lab/fastify-multer';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Properties')
@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post('create')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor("files", 4))
  @ApiOperation({ summary: 'Crear una nueva propiedad' })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Datos de la nueva propiedad',
    schema: {
      type: 'object',
      properties: {
        property: {
          type: 'string',
          description: 'Datos de la propiedad en formato JSON',
          example: JSON.stringify({
            title: "Casa moderna con piscina",
            description: "Una casa moderna con piscina y jardín amplio, ubicada en una zona residencial tranquila.",
            longDescription: "Esta es una descripción larga de la propiedad, proporcionando más detalles y características.",
            price: 4500,
            type: "house",
            status: ["for_rent"],
            lotSize: 200,
            area: 180,
            rooms: 4,
            bathrooms: 3,
            address: "5678 Oak Avenue",
            geoCoordinates: { lat: 34.052235, lng: -118.243683 },
            neighborhood: "Beverly Hills",
            city: "Los Angeles",
            yearBuilt: 2018,
            garage: true,
            imageSrc: [
              "https://example.com/images/villa_front.jpg",
              "https://example.com/images/villa_pool.jpg",
              "https://example.com/images/villa_garden.jpg"
            ],
            contribution: "2000 USD",
            pinned: false
          })
        },
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary'
          },
          description: 'Archivos de imágenes de la propiedad'
        }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Propiedad creada exitosamente', type: PropertyDto })
  @ApiResponse({ status: 400, description: 'Ya existe una propiedad con ese título' })
  @ApiResponse({ status: 401, description: 'No autorizado (Token faltante o inválido)', type: UnauthorizedException })
  @ApiResponse({ status: 500, description: 'Error interno del servidor', type: HttpException })
  async create(
    @Body('property') property: string,
    @UploadedFiles() files: Array<File>,
    @Req() request: RequestWithUser
  ): Promise<PropertyDto> {
    const propertyDto: PropertyDto = JSON.parse(property);
    return await this.propertyService.create(propertyDto, request.user, files);
  }

  @Get('terms')
  @ApiOperation({ summary: 'Obtener los términos y condiciones' })
  @ApiResponse({ status: 200, description: 'Términos y condiciones obtenidos correctamente', type: String })
  @ApiResponse({ status: 404, description: 'No se encontraron términos y condiciones', type: NotFoundException })
  @ApiResponse({ status: 500, description: 'Error interno del servidor', type: HttpException })
  async termsAndConditions(): Promise<string> {
    return await this.propertyService.getTermsAndConditions();
  }


  @Post('update')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor("files", 4))
  @ApiOperation({ summary: 'Actualizar una propiedad existente' })
  @ApiBearerAuth()
  @ApiBody({ description: 'Datos de la propiedad para actualizar', type: PropertyDto })
  @ApiResponse({ status: 200, description: 'Propiedad actualizada exitosamente', type: PropertyDto })
  @ApiResponse({ status: 401, description: 'No autorizado (Token faltante o inválido)', type: UnauthorizedException })
  @ApiResponse({ status: 404, description: 'Propiedad no encontrada', type: NotFoundException })
  @ApiResponse({ status: 500, description: 'Error interno del servidor', type: HttpException })
  async update(
    @Body('property') property: string,
    @UploadedFiles() files: Array<File>,
    @Req() request: RequestWithUser
  ): Promise<PropertyDto> {
    const propertyDto: PropertyDto = JSON.parse(property);
    return await this.propertyService.update(propertyDto, request.user, files);
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
