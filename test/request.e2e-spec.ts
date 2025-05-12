import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { User } from '../src/users/entities/user.entity';
import { Request as RequestEntity } from '../src/requests/entities/request.entity';

describe('RequestsController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = moduleFixture.get(DataSource);
  });

  afterAll(async () => {
    await app.close();
  });

  it('PATCH /api/v1/requests/:id → actualizar solicitud', async () => {
    const userRepository = dataSource.getRepository(User);
    const requestRepository = dataSource.getRepository(RequestEntity);

    // Crear un usuario válido
    const user = await userRepository.save({
      name: 'Usuario Prueba',
      email: 'usuario@example.com',
      password: 'securePass123',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Crear una solicitud (request) asociada al usuario
    const savedRequest = await requestRepository.save({
      title: 'Solicitud inicial',
      description: 'Descripción de prueba',
      status: 'pending',
      user: user, // relación
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Datos de actualización
    const updateData = {
      status: 'approved',
    };

    const response = await request(app.getHttpServer())
      .patch(`/api/v1/requests/${savedRequest.id}`)
      .send(updateData)
      .expect(200);

    expect(response.body.status).toBe('approved');
    expect(response.body.id).toBe(savedRequest.id);
  });
});
