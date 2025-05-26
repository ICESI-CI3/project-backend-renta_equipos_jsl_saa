import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001', // Cambia esto a la URL de tu frontend
    credentials: true, // Permite el envío de cookies y encabezados de autorización
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  })

  const config = new DocumentBuilder()
    .setTitle('API de gestión de dispositivos')
    .setDescription('API para gestionar dispositivos y solicitudes')
    .setVersion('1.0')
    .addTag('auth')
    .addBearerAuth()
    .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);
  
  await app.listen(process.env.PORT ?? 3000);

}
bootstrap();
