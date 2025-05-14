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

  const logInDto = {
    email: 'carlos@example.com',
    password: 'hashedpass2'
  };

  it('/api/v1/users/accept/:id (PATCH) acepta un contrato', async () => {
    
    const res = await request(httpServer)
      .post('/api/v1/auth/login')
      .send(logInDto)
      .expect(200);
    const { access_token } = res.body;
    const response = await request(httpServer)
      .patch('/api/v1/users/accept/20000000-0000-0000-0000-000000000001')
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200);
  });
});
