import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000', 
      'http://localhost:3001', 
      process.env.NEXT_PUBLIC_BACKEND_URL?.replace('/api', '') || 'http://localhost:3000',
    ].filter(Boolean),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

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
