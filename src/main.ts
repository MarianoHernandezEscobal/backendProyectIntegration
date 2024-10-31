// main.ts
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const port = parseInt(process.env.PORT, 10) || 3000;
  const env = process.env.NODE_ENV || 'development';

  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Inmobiliaria API')
    .setDescription('Inmobiliaria Costa Azul Back End')
    .setVersion('1.0')
    .addTag('Inmobiliaria')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()} in ${env} mode`);
}

bootstrap();
