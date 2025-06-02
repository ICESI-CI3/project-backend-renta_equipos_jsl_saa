import { Test, TestingModule } from '@nestjs/testing';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';

describe('RequestsController', () => {
  let controller: RequestsController;
  let service: RequestsService;

  const mockService = {
    getAllRequests: jest.fn(),
    getRequestById: jest.fn(),
    updateRequest: jest.fn(),
    deleteRequest: jest.fn(),
    createRequest: jest.fn(),
    getRequestByUserEmail: jest.fn(),
    getRequestByStatus: jest.fn(),
  };

  const validDto: CreateRequestDto = {
    user_email: 'usuario@example.com',
    date_start: new Date('2025-05-10T08:00:00Z'),
    date_Finish: new Date('2025-05-15T18:00:00Z'),
    validateDates: true,
    status: 'pendiente',
    admin_comment: 'Comentario de prueba',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestsController],
      providers: [{ provide: RequestsService, useValue: mockService }],
    }).compile();

    controller = module.get<RequestsController>(RequestsController);
    service = module.get<RequestsService>(RequestsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all requests', async () => {
    const result = [validDto];
    mockService.getAllRequests.mockResolvedValue(result);
    expect(await controller.getAllRequests()).toBe(result);
  });

  it('should return request by id', async () => {
    const result = { id: 'uuid-123', ...validDto };
    mockService.getRequestById.mockResolvedValue(result);
    expect(await controller.getById('uuid-123')).toBe(result);
  });

  it('should update request by id', async () => {
    const updated = { id: 'uuid-123', ...validDto, status: 'aprobada' };
    mockService.updateRequest.mockResolvedValue(updated);
    expect(await controller.update('uuid-123', validDto)).toBe(updated);
  });

  it('should delete request by id', async () => {
    const result = { deleted: true };
    mockService.deleteRequest.mockResolvedValue(result);
    expect(await controller.delete('uuid-123')).toBe(result);
  });

  it('should create a request', async () => {
    const result = { id: 'uuid-123', ...validDto };
    mockService.createRequest.mockResolvedValue(result);
    expect(await controller.create(validDto)).toBe(result);
  });

  it('should get requests by user email', async () => {
    const result = [{ id: 'uuid-123', ...validDto }];
    mockService.getRequestByUserEmail.mockResolvedValue(result);
    expect(await controller.getByUserEmail('usuario@example.com')).toBe(result);
  });

  it('should get requests by status', async () => {
    const result = [{ id: 'uuid-123', ...validDto }];
    mockService.getRequestByStatus.mockResolvedValue(result);
    expect(await controller.getByStatus('pendiente')).toBe(result);
  });
});