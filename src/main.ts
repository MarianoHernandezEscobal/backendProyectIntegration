// main.ts
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Obtiene ConfigService desde la instancia de la aplicación
  const configService = app.get(ConfigService);

  // Configuración de CORS usando ConfigService
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN'),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  });

  // Configuración de Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Inmobiliaria API')
    .setDescription('Inmobiliaria Costa Azul Back End')
    .setVersion('1.0')
    .addTag('Inmobiliaria')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  // Usa ConfigService para obtener el puerto y el entorno
  const port = configService.get<number>('PORT') || 3000;
  const env = configService.get<string>('NODE_ENV') || 'development';

  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()} in ${env} mode`);
}

bootstrap();
