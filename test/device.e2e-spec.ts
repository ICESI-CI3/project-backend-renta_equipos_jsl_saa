import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateDeviceDto } from 'src/devices/dto/create-device.dto';
import { DataSource } from 'typeorm';

describe('DevicesController (e2e)', () => {
  let app: INestApplication;
  let httpServer: any;
  let dataSource: DataSource;

  const testDevice: CreateDeviceDto = {
    name: 'Test Device',
    description: 'Device for testing',
    type: 'Sensor',
    status: 'Available',
    owner: 'Admin',
    image: 'http://example.com/image.jpg',
  };

  let createdDeviceId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    dataSource = moduleFixture.get(DataSource);

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  it('/POST devices - Create Device', async () => {
    const response = await request(httpServer)
      .post('/api/v1/devices')
      .send({ ...testDevice, stock: 1 }) // stock se pasa como parte del body
      .expect(201);

    expect(response.body).toBeDefined();
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
    expect(response.body[0].name).toBe(testDevice.name);

    createdDeviceId = response.body[0].id;
  });

  it('/GET devices - Get all devices', async () => {
    const response = await request(httpServer)
      .get('/api/v1/devices')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/GET devices/:id - Get device by ID', async () => {
    const response = await request(httpServer)
      .get(`/api/v1/devices/${createdDeviceId}`)
      .expect(200);

    expect(response.body).toBeDefined();
    expect(response.body.id).toBe(createdDeviceId);
    expect(response.body.name).toBe(testDevice.name);
  });

  it('/GET devices/stock/:name - Get stock by device name', async () => {
    const response = await request(httpServer)
      .get(`/api/v1/devices/stock/${testDevice.name}`)
      .expect(200);

    expect(typeof response.body).toBe('number');
    expect(response.body).toBeGreaterThan(0);
  });

  it('/PATCH devices/:id - Update device', async () => {
    const updatedDevice = { ...testDevice, description: 'Updated description' };

    const response = await request(httpServer)
      .patch(`/api/v1/devices/${createdDeviceId}`)
      .send(updatedDevice)
      .expect(200);

    expect(response.body).toBeDefined();
    expect(response.body.description).toBe('Updated description');
  });

  it('/DELETE devices/:id - Delete device', async () => {
    await request(httpServer)
      .delete(`/api/v1/devices/${createdDeviceId}`)
      .expect(200);

    // Verifica que ya no exista
    await request(httpServer)
      .get(`/api/v1/devices/${createdDeviceId}`)
      .expect(404);
  });
});
