import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from './../src/app.module';
import * as request from "supertest";

describe('DeviceController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
          imports: [AppModule],
        }).compile();
    
        app = moduleFixture.createNestApplication();
    
        // pipes globales 
        /* app.useGlobalPipes(
          new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
          }),
        ); */
    
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    let createdDeviceId: string;

    it('/api/v1/devices (POST) - debe crear un dispositivo', async () => {
        const res = await request(app.getHttpServer())
        .post('/api/v1/devices/10') // Incluye el stock como parámetro
        .send({
            name: 'Laptop',
            description: 'Laptop Dell con pantalla de 15 pulgadas',
            type: 'Laptop',
            status: 'activo',
            owner: 'Empresa ABC',
            image: 'http://example.com/image.jpg',
        });

        console.log(res.body);

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('name', 'Laptop');
        expect(res.body).toHaveProperty('status', 'activo');
        createdDeviceId = res.body.id; // Guardar el ID para pruebas posteriores
    });

    it('/api/v1/devices (GET) - debe obtener todos los dispositivos', async () => {
        const res = await request(app.getHttpServer()).get('/api/v1/devices');

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('/api/v1/devices/:id (GET) - debe obtener un dispositivo por ID', async () => {
        const res = await request(app.getHttpServer()).get(
        `/api/v1/devices/${createdDeviceId}`,
        );

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id', createdDeviceId);
        expect(res.body).toHaveProperty('name', 'Laptop');
    });

    it('/api/v1/devices/:id (PATCH) - debe actualizar un dispositivo', async () => {
        const res = await request(app.getHttpServer())
        .patch(`/api/v1/devices/${createdDeviceId}`)
        .send({
            name: 'Laptop Actualizada',
            description: 'Laptop Dell actualizada con pantalla de 17 pulgadas',
            type: 'Laptop',
            status: 'inactivo',
            owner: 'Empresa XYZ',
            image: 'http://example.com/updated_image.jpg',
        });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id', createdDeviceId);
        expect(res.body).toHaveProperty('name', 'Laptop Actualizada');
        expect(res.body).toHaveProperty('status', 'inactivo');
    });

    it('/api/v1/devices/:id (DELETE) - debe eliminar un dispositivo', async () => {
        const res = await request(app.getHttpServer()).delete(
        `/api/v1/devices/${createdDeviceId}`,
        );

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty(
        'message',
        'Dispositivo eliminado exitosamente',
        );
    });

    it('/api/v1/devices/:id (GET) - debe devolver 404 para un dispositivo eliminado', async () => {
        const res = await request(app.getHttpServer()).get(
        `/api/v1/devices/${createdDeviceId}`,
        );

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', 'Dispositivo no encontrado');
    });

    it('/api/v1/devices/stock/:name (GET) - debe obtener el stock de un dispositivo por nombre', async () => {
        const res = await request(app.getHttpServer()).get(
        '/api/v1/devices/stock/Laptop',
        );

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('stock');
        expect(res.body.stock).toBeGreaterThanOrEqual(0);
    });
});