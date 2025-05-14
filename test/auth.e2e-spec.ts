import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let createdUserId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Si usas pipes globales en main.ts, agrégalos aquí también
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/v1/auth/register (POST) - debe registrar un usuario', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        name: 'testsuser',
        email: 'tesstuser@eexample.com',
        password: 'securePassword123',
        cellphone: '1234567890',
        address: '123 Test St',
      });
        
    console.log(res.body);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('name', 'testsuser');
    expect(res.body).toHaveProperty('email', 'tesstuser@eexample.com');
    expect(res.body).toHaveProperty('cellphone', '1234567890');
    expect(res.body).toHaveProperty('address', '123 Test St');
    expect(res.body).toHaveProperty('role', 'user');
  });

  it('/api/v1/auth/login (POST) - debe autenticar al usuario y devolver token', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'tesstuser@eexample.com',
        password: 'securePassword123',
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('access_token');
  });

  it('/api/v1/auth/login (POST) - credenciales incorrectas', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'tesstuser@eexample.com',
        password: 'wrongPassword',
      });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid credentials');
  });

  const userDto = {
      name: 'Juan Pérez',
      email: 'juan.perez@example.com',
      password: 'Segura123',
      cellphone: '3001234567',
      address: 'Calle 123 #45-67, Bogotá',
    };
  
    it('/api/v1/auth/register (POST) crea un nuevo usuario', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth')
        .send(userDto)
        .expect(201);
  
      expect(response.body).toHaveProperty('id');
      createdUserId = response.body.id;
      expect(response.body.email).toBe(userDto.email);
    });
  
    it('/api/v1/auth (GET) obtiene todos los usuarios', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/auth')
        .query({ limit: 10, offset: 0 })
        .expect(200);
  
      expect(Array.isArray(response.body)).toBe(true);
    });
  
    it('/api/v1/auth/:id (GET) obtiene usuario por ID', async () => {
      expect(createdUserId).toBeDefined();
  
      const response = await request(app.getHttpServer())
        .get(`/api/v1/auth/${createdUserId}`)
        .expect(200);
  
      expect(response.body.id).toBe(createdUserId);
    });
  
    it('/api/v1/auth/:id (PUT) actualiza un usuario', async () => {
      expect(createdUserId).toBeDefined();
  
      const updatedData = {
        ...userDto,
        name: 'Juan Actualizado',
      };
  
      const response = await request(app.getHttpServer())
        .put(`/api/v1/auth/${createdUserId}`)
        .send(updatedData)
        .expect(200);
  
      expect(response.body.name).toBe('Juan Actualizado');
    });
  
    it('/api/v1/auth/:id (DELETE) elimina un usuario', async () => {
      expect(createdUserId).toBeDefined();
  
      await request(app.getHttpServer())
        .delete(`/api/v1/auth/${createdUserId}`)
        .expect(200);
    });
});
