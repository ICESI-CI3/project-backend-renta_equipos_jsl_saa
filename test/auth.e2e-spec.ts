import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

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
});
