import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from './../src/app.module';
import * as request from "supertest";

describe('ContractController (e2e)', ()=> {
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

    let createdContractId: string;

    it('/api/v1/contracts (POST) - debe crear un contrato', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/contracts')
        .send({
          id: '123e4567-e89b-12d3-a456-426614174000',
          user_email: 'alice@example.com',
          request_id: '20000000-0000-0000-0000-000000000001',
          date_start: '2025-05-01T00:00:00.000Z',
          date_finish: '2025-06-01T00:00:00.000Z',
          status: 'active',
          client_signature: 'firma_digital_alice.png',
        });
      
        console.log(res.body);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('user_email', 'alice@example.com');
      expect(res.body).toHaveProperty('status', 'active');
      createdContractId = res.body.id; // Guardar el ID para pruebas posteriores
    });

    it('/api/v1/contracts (GET) - debe obtener todos los contratos', async () => {
      const res = await request(app.getHttpServer()).get('/api/v1/contracts');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      });
      it('/api/v1/contracts/:id (GET) - debe obtener un contrato por ID', async () => {
      const res = await request(app.getHttpServer()).get(
        `/api/v1/contracts/${createdContractId}`,
      );

        console.log(res.body);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', createdContractId);
      expect(res.body).toHaveProperty('user_email', 'alice@example.com');
    });

  it('/api/v1/contracts/:id (PUT) - debe actualizar un contrato', async () => {
    const res = await request(app.getHttpServer())
      .put(`/api/v1/contracts/${createdContractId}`)
      .send({
        id: createdContractId,
        user_email: 'alice@example.com',
        request_id: '20000000-0000-0000-0000-000000000001',
        date_start: '2025-05-01T00:00:00.000Z',
        date_finish: '2025-06-01T00:00:00.000Z',
        status: 'pending', // Cambiar estado
        client_signature: 'firma_actualizada.png',
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', createdContractId);
    expect(res.body).toHaveProperty('status', 'pending');
  });

  it('/api/v1/contracts/:id (DELETE) - debe eliminar un contrato', async () => {
    const res = await request(app.getHttpServer()).delete(
      `/api/v1/contracts/${createdContractId}`,
    );

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty(
      'message',
      'Contrato eliminado exitosamente',
    );
  });

  it('/api/v1/contracts/:id (GET) - debe devolver 404 para un contrato eliminado', async () => {
    const res = await request(app.getHttpServer()).get(
      `/api/v1/contracts/${createdContractId}`,
    );

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message', 'El contrato no existe');
  });
});