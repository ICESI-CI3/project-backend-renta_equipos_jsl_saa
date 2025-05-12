import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let httpServer: any;
  let dataSource: DataSource;
  let createdUserId: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    httpServer = app.getHttpServer();
    dataSource = app.get(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  const userDto = {
    name: 'Juan Pérez',
    email: 'juan.perez@example.com',
    password: 'Segura123',
    cellphone: '3001234567',
    address: 'Calle 123 #45-67, Bogotá',
  };

  it('/api/v1/users (POST) crea un nuevo usuario', async () => {
    const response = await request(httpServer)
      .post('/api/v1/users')
      .send(userDto)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    createdUserId = response.body.id;
    expect(response.body.email).toBe(userDto.email);
  });

  it('/api/v1/users (GET) obtiene todos los usuarios', async () => {
    const response = await request(httpServer)
      .get('/api/v1/users')
      .query({ limit: 10, offset: 0 })
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('/api/v1/users/:id (GET) obtiene usuario por ID', async () => {
    expect(createdUserId).toBeDefined();

    const response = await request(httpServer)
      .get(`/api/v1/users/${createdUserId}`)
      .expect(200);

    expect(response.body.id).toBe(createdUserId);
  });

  it('/api/v1/users/:id (PUT) actualiza un usuario', async () => {
    expect(createdUserId).toBeDefined();

    const updatedData = {
      ...userDto,
      name: 'Juan Actualizado',
    };

    const response = await request(httpServer)
      .put(`/api/v1/users/${createdUserId}`)
      .send(updatedData)
      .expect(200);

    expect(response.body.name).toBe('Juan Actualizado');
  });

  it('/api/v1/users/:id (DELETE) elimina un usuario', async () => {
    expect(createdUserId).toBeDefined();

    await request(httpServer)
      .delete(`/api/v1/users/${createdUserId}`)
      .expect(200);
  });
});
