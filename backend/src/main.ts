import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {/*  */

  const logger: Logger = new Logger('----- Bootstrap -----');

  const app = await NestFactory.create(AppModule);

  // Obtener ConfigService del contenedor de dependencias
  const configService = app.get(ConfigService);

  const PORT: number = configService.get<number>('PORT') || 3000;
  const API_PREFIX: string =
    configService.get<string>('API_PREFIX') || 'api/v1';

  app.setGlobalPrefix(API_PREFIX);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Allow implicit conversion of types
      },
    }),
  );

  // Configuración de CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('TypeORM PostgreSQL')
    .setDescription('TypeORM PostgreSQL')
    .setVersion('1.0')
    .addTag('TypeORM PostgreSQL')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  await app.listen(PORT);
  logger.log(
    `Application is running on: http://localhost:${PORT}/${API_PREFIX}`,
  );
  logger.log(
    `Environment: ${configService.get<string>('NODE_ENV') || 'development'}`,
  );
}
await bootstrap();
