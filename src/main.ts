// main.ts
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import fastifyCookie from '@fastify/cookie';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const configService = app.get(ConfigService);

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });

  console.log(configService.get<string>('CORS_ORIGIN'));

  await app.register(fastifyCookie, { secret: 'eeeeeee' });
  
  // Configuración de Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Inmobiliaria API')
    .setDescription('Inmobiliaria Costa Azul Back End')
    .setVersion('1.0')
    .addTag('Inmobiliaria')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  const port = configService.get<number>('PORT') || 3000;
  const env = configService.get<string>('NODE_ENV') || 'development';

  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()} in ${env} mode`);
}

bootstrap();
