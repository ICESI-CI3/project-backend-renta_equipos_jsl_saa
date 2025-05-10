import { Test, TestingModule } from '@nestjs/testing';
import { RequestsService } from './requests.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Request } from './entities/request.entity';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateRequestDto } from './dto/create-request.dto';

const mockRequest: Request = {
  id: 'uuid-1234',
  user_email: 'test@example.com',
  date_start: new Date(),
  date_finish: new Date(),
  status: 'pending',
  admin_comment: 'Initial comment',
};

const mockUser: User = {
  id: 'user-1',
  name: 'Test User',
  email: 'test@example.com',
  password: 'hashedpassword',
  cellphone: '1234567890',
  address: '123 Test Street',
  role: 'user',
};

describe('RequestsService', () => {
  let service: RequestsService;
  let requestRepository: Repository<Request>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestsService,
        {
          provide: getRepositoryToken(Request),
          useValue: {
            create: jest.fn().mockReturnValue(mockRequest),
            save: jest.fn().mockResolvedValue(mockRequest),
            find: jest.fn().mockResolvedValue([mockRequest]),
            findOne: jest.fn().mockResolvedValue(mockRequest),
            update: jest.fn().mockResolvedValue(undefined),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockUser),
          },
        },
      ],
    }).compile();

    service = module.get<RequestsService>(RequestsService);
    requestRepository = module.get(getRepositoryToken(Request));
    userRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createRequest', () => {
    it('should create and return a request', async () => {
      const dto: CreateRequestDto = {
        id: 'uuid-1234',
        user_email: 'test@example.com',
        date_start: new Date(),
        date_finish: new Date(),
        status: 'pending',
        admin_comment: 'Initial comment',
      };
      const result = await service.createRequest(dto);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email: dto.user_email } });
      expect(requestRepository.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockRequest);
    });

    it('should throw error if user does not exist', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.createRequest({ ...mockRequest }))
        .rejects
        .toThrow('El usuario no existe');
    });
  });

  describe('getAllRequests', () => {
    it('should return all requests', async () => {
      const result = await service.getAllRequests();
      expect(result).toEqual([mockRequest]);
    });
  });

  describe('getRequestById', () => {
    it('should return a request by ID', async () => {
      const result = await service.getRequestById('uuid-1234');
      expect(result).toEqual(mockRequest);
    });

    it('should throw if request does not exist', async () => {
      jest.spyOn(requestRepository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.getRequestById('invalid-id'))
        .rejects
        .toThrow('La solicitud no existe');
    });
  });

  describe('updateRequest', () => {
    it('should update and return updated request', async () => {
      const dto: CreateRequestDto = { ...mockRequest };
      const result = await service.updateRequest('uuid-1234', dto);
      expect(result).toEqual(mockRequest);
    });

    it('should throw if request to update is not found', async () => {
      jest.spyOn(requestRepository, 'findOne')
        .mockResolvedValueOnce(null);
      await expect(service.updateRequest('invalid-id', { ...mockRequest }))
        .rejects
        .toThrow('La solicitud no existe');
    });
  });

  describe('deleteRequest', () => {
    it('should delete a request', async () => {
      await expect(service.deleteRequest('uuid-1234')).resolves.not.toThrow();
    });

    it('should throw if request to delete does not exist', async () => {
      jest.spyOn(requestRepository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.deleteRequest('invalid-id'))
        .rejects
        .toThrow('La solicitud no existe');
    });
  });

  describe('getRequestByUserEmail', () => {
    it('should return requests by user email', async () => {
      const result = await service.getRequestByUserEmail('test@example.com');
      expect(result).toEqual([mockRequest]);
    });

    it('should throw if no requests found', async () => {
      jest.spyOn(requestRepository, 'find').mockResolvedValueOnce([]);
      await expect(service.getRequestByUserEmail('noemail@example.com'))
        .rejects
        .toThrow('No se encontraron solicitudes para este usuario');
    });
  });

  describe('getRequestByStatus', () => {
    it('should return requests by status', async () => {
      const result = await service.getRequestByStatus('pending');
      expect(result).toEqual([mockRequest]);
    });

    it('should throw if no requests found with status', async () => {
      jest.spyOn(requestRepository, 'find').mockResolvedValueOnce([]);
      await expect(service.getRequestByStatus('unknown'))
        .rejects
        .toThrow('No se encontraron solicitudes con este estado');
    });
  });

});
