import { Test, TestingModule } from '@nestjs/testing';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';

describe('RequestsController', () => {
  let controller: RequestsController;
  let service: RequestsService;

  const mockRequestsService = {
    getAllRequests: jest.fn(),
    getRequestById: jest.fn(),
    updateRequest: jest.fn(),
    deleteRequest: jest.fn(),
    createRequest: jest.fn(),
    getRequestByUserDocument: jest.fn(),
    getRequestByStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestsController],
      providers: [
        {
          provide: RequestsService,
          useValue: mockRequestsService,
        },
      ],
    }).compile();

    controller = module.get<RequestsController>(RequestsController);
    service = module.get<RequestsService>(RequestsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllRequests', () => {
    it('should call RequestsService.getAllRequests', () => {
      controller.getAllRequests();
      expect(service.getAllRequests).toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('should call RequestsService.getRequestById with correct id', () => {
      const id = 'some-uuid';
      controller.getById(id);
      expect(service.getRequestById).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should call RequestsService.updateRequest with correct id and request', () => {
      const id = 'some-uuid';
      const request: CreateRequestDto = {
        id: '1',
        user_Document: '12345',
        date_Request: new Date(),
        status: 'pending',
        admin_comment: 'Initial request',
      };
      controller.update(id, request);
      expect(service.updateRequest).toHaveBeenCalledWith(id, request);
    });
  });

  describe('delete', () => {
    it('should call RequestsService.deleteRequest with correct id', () => {
      const id = 'some-uuid';
      controller.delete(id);
      expect(service.deleteRequest).toHaveBeenCalledWith(id);
    });
  });

  describe('create', () => {
    it('should call RequestsService.createRequest with correct request', () => {
      const request: CreateRequestDto = {
        id: '1',
        user_Document: '12345',
        date_Request: new Date(),
        status: 'pending',
        admin_comment: 'Initial request',
      };
      controller.create(request);
      expect(service.createRequest).toHaveBeenCalledWith(request);
    });
  });

  describe('getByUserDocument', () => {
    it('should call RequestsService.getRequestByUserDocument with correct user_Document', () => {
      const user_Document = '12345';
      controller.getByUserDocument(user_Document);
      expect(service.getRequestByUserDocument).toHaveBeenCalledWith(user_Document);
    });
  });

  describe('getByStatus', () => {
    it('should call RequestsService.getRequestByStatus with correct status', () => {
      const status = 'pending';
      controller.getByStatus(status);
      expect(service.getRequestByStatus).toHaveBeenCalledWith(status);
    });
  });
});