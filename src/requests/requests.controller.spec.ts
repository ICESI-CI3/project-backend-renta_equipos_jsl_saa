import { Test, TestingModule } from '@nestjs/testing';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { Request } from './entities/request.entity';

describe('RequestsController', () => {
  let controller: RequestsController;
  let service: RequestsService;

  const mockRequest: Request = {
    id: 'uuid-1234',
    user_email: 'test@example.com',
    date_Request: new Date(),
    status: 'pending',
    admin_comment: 'Test comment',
  };

  const mockService = {
    getAllRequests: jest.fn().mockResolvedValue([mockRequest]),
    getRequestById: jest.fn().mockResolvedValue(mockRequest),
    updateRequest: jest.fn().mockResolvedValue(mockRequest),
    deleteRequest: jest.fn().mockResolvedValue(undefined),
    createRequest: jest.fn().mockResolvedValue(mockRequest),
    getRequestByUserEmail: jest.fn().mockResolvedValue([mockRequest]),
    getRequestByStatus: jest.fn().mockResolvedValue([mockRequest]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestsController],
      providers: [{ provide: RequestsService, useValue: mockService }],
    }).compile();

    controller = module.get<RequestsController>(RequestsController);
    service = module.get<RequestsService>(RequestsService);
  });

  it('should return all requests', async () => {
    const result = await controller.getAllRequests();
    expect(result).toEqual([mockRequest]);
    expect(service.getAllRequests).toHaveBeenCalled();
  });

  it('should return a request by ID', async () => {
    const result = await controller.getById('uuid-1234');
    expect(result).toEqual(mockRequest);
    expect(service.getRequestById).toHaveBeenCalledWith('uuid-1234');
  });

  it('should update a request', async () => {
    const dto: CreateRequestDto = {
      id: 'uuid-1234',
      user_email: 'test@example.com',
      date_Request: new Date(),
      status: 'approved',
      admin_comment: 'Updated',
    };
    const result = await controller.update('uuid-1234', dto);
    expect(result).toEqual(mockRequest);
    expect(service.updateRequest).toHaveBeenCalledWith('uuid-1234', dto);
  });

  it('should delete a request', async () => {
    const result = await controller.delete('uuid-1234');
    expect(result).toBeUndefined();
    expect(service.deleteRequest).toHaveBeenCalledWith('uuid-1234');
  });

  it('should create a new request', async () => {
    const dto: CreateRequestDto = {
      id: 'uuid-1234',
      user_email: 'test@example.com',
      date_Request: new Date(),
      status: 'pending',
      admin_comment: 'New request',
    };
    const result = await controller.create(dto);
    expect(result).toEqual(mockRequest);
    expect(service.createRequest).toHaveBeenCalledWith(dto);
  });

  it('should return requests by user email', async () => {
    const result = await controller.getByUserEmail('test@example.com');
    expect(result).toEqual([mockRequest]);
    expect(service.getRequestByUserEmail).toHaveBeenCalledWith('test@example.com');
  });

  it('should return requests by status', async () => {
    const result = await controller.getByStatus('pending');
    expect(result).toEqual([mockRequest]);
    expect(service.getRequestByStatus).toHaveBeenCalledWith('pending');
  });
});
