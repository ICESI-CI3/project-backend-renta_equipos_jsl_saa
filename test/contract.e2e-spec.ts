import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app.module";
import * as request from "supertest";

describe('ContractController (e2e)', ()=> {
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

  it('/api/v1/contracts (POST) - debe crear un contrato', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/contracts')
      .send({
        user_email: 'test_user@example.com',
        
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('name', 'Test Contract');
    expect(res.body).toHaveProperty('description', 'This is a test contract');
  });
})