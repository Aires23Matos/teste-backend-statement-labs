import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './presentation/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  // Global filters
  app.useGlobalFilters(new HttpExceptionFilter());
  
  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('API de Gerenciamento de Estacionamento')
    .setDescription('Sistema de Gerenciamento de Estacionamento')
    .setVersion('1.0')
    .addTag('Estacionamento')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`
     Parking System API is running!
     API Documentation: http://localhost:${port}/api-docs
     API Base URL: http://localhost:${port}/api
     Database Type: ${process.env.DB_TYPE || 'memory'}
  `);
}
bootstrap();