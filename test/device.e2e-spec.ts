import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module'; // ajusta el path según tu estructura

describe('DevicesController (e2e)', () => {
  let app: INestApplication;
  let createdDeviceId: string;
  const deviceName = 'Laptop Test';

  const mockDevice = {
    name: deviceName,
    description: 'Laptop para pruebas',
    type: 'Laptop',
    status: 'activo',
    owner: 'Empresa Test',
    image: 'http://example.com/image.jpg',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], // asegúrate de que esté correctamente configurado
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  it('POST /api/v1/devices/:stock - crea un dispositivo', async () => {
    const stock = 1;
    const response = await request(app.getHttpServer())
      .post(`/api/v1/devices/${stock}`)
      .send(mockDevice)
      .expect(201);

    expect(response.text).toBe('Device created successfully');
  });

  it('GET /api/v1/devices - obtiene todos los dispositivos', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/devices')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    const found = response.body.find((d) => d.name === deviceName);
    expect(found).toBeDefined();
    createdDeviceId = found.id;
  });

  it('GET /api/v1/devices/:id - obtiene dispositivo por ID', async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/v1/devices/${createdDeviceId}`)
      .expect(200);

    expect(response.body.name).toBe(deviceName);
  });

  const logInDto = {
    email: 'carlos@example.com',
    password: 'hashedpass2'
  };

  it('PATCH /api/v1/devices/:id - actualiza un dispositivo', async () => {
    const updatedData = { ...mockDevice, description: 'Actualizado' };

    const res = await request(app.getHttpServer())
          .post('/api/v1/auth/login')
          .send(logInDto)
          .expect(200);

    const { access_token } = res.body;
    const response = await request(app.getHttpServer())
      .patch(`/api/v1/devices/${createdDeviceId}`)
      .set('Authorization', `Bearer ${access_token}`)
      .send(updatedData)
      .expect(200);

    expect(response.body.description).toBe('Actualizado');
  });

  it('GET /api/v1/devices/stock/:name - obtiene stock', async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/v1/devices/stock/${deviceName}`)
      .expect(200);

    expect(response.body).toBe(1);
  });

  it('DELETE /api/v1/devices/:id - elimina dispositivo', async () => {
    
    const res = await request(app.getHttpServer())
          .post('/api/v1/auth/login')
          .send(logInDto)
          .expect(200);

    const { access_token } = res.body;
    
    await request(app.getHttpServer())
      .delete(`/api/v1/devices/${createdDeviceId}`)
      .set('Authorization', `Bearer ${access_token}`) // reemplaza si usas Auth
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
