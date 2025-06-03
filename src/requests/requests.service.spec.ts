import { Test, TestingModule } from '@nestjs/testing';
import { RequestsService } from './requests.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Request } from './entities/request.entity';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';

const mockRequestRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockUserRepository = {
  findOne: jest.fn(),
};

describe('RequestsService', () => {
  let service: RequestsService;
  let requestRepo: Repository<Request>;
  let userRepo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestsService,
        {
          provide: getRepositoryToken(Request),
          useValue: mockRequestRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<RequestsService>(RequestsService);
    requestRepo = module.get<Repository<Request>>(getRepositoryToken(Request));
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));

    jest.clearAllMocks();
  });

  const requestDto = {
    user_email: 'test@example.com',
    date_start: '2025-05-10T00:00:00.000Z',
    date_Finish: '2025-05-15T00:00:00.000Z',
    status: 'pendiente',
    admin_comment: 'Comentario de prueba',
    validateDates: true,
  };

  describe('createRequest', () => {
    it('debería crear una solicitud si el usuario existe', async () => {
      mockUserRepository.findOne.mockResolvedValueOnce({ email: requestDto.user_email });
      mockRequestRepository.create.mockReturnValue(requestDto);
      mockRequestRepository.save.mockResolvedValueOnce({ id: '1', ...requestDto });

      const result = await service.createRequest(requestDto);

      expect(result).toEqual({ id: '1', ...requestDto });
      expect(mockRequestRepository.save).toHaveBeenCalled();
    });

    it('debería lanzar un error si el usuario no existe', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.createRequest(requestDto)).rejects.toThrow('El usuario no existe');
    });

    it('debería mapear correctamente los campos del DTO', async () => {
      mockUserRepository.findOne.mockResolvedValueOnce({ email: requestDto.user_email });
      const spyCreate = jest.spyOn(mockRequestRepository, 'create');
      mockRequestRepository.save.mockResolvedValueOnce({ id: '1', ...requestDto });

      await service.createRequest(requestDto);

      expect(spyCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          user_email: requestDto.user_email,
          date_start: requestDto.date_start,
          date_finish: requestDto.date_Finish,
          status: requestDto.status,
          admin_comment: requestDto.admin_comment,
        }),
      );
    });
  });

  describe('getAllRequests', () => {
    it('debería retornar todas las solicitudes', async () => {
      const requests = [{ id: '1', ...requestDto }];
      mockRequestRepository.find.mockResolvedValue(requests);

      const result = await service.getAllRequests();
      expect(result).toEqual(requests);
    });
  });

  describe('getRequestById', () => {
    it('debería retornar la solicitud si existe', async () => {
      const request = { id: '1', ...requestDto };
      mockRequestRepository.findOne.mockResolvedValue(request);

      const result = await service.getRequestById('1');
      expect(result).toEqual(request);
    });

    it('debería lanzar error si no encuentra la solicitud', async () => {
      mockRequestRepository.findOne.mockResolvedValue(null);

      await expect(service.getRequestById('1')).rejects.toThrow();
    });
  });

  describe('updateRequest', () => {
    it('debería actualizar una solicitud existente', async () => {
      mockRequestRepository.findOne
        .mockResolvedValueOnce({ id: '1' }) // existe
        .mockResolvedValueOnce({ id: '1', ...requestDto }); // actualizado
      mockRequestRepository.update.mockResolvedValue({});

      const result = await service.updateRequest('1', requestDto);
      expect(result).toEqual({ id: '1', ...requestDto });
    });

    it('debería lanzar error si no encuentra la solicitud a actualizar', async () => {
      mockRequestRepository.findOne.mockResolvedValue(null);
      await expect(service.updateRequest('1', requestDto)).rejects.toThrow();
    });
  });

  describe('deleteRequest', () => {
    it('debería eliminar una solicitud existente', async () => {
      mockRequestRepository.findOne.mockResolvedValue({ id: '1' });
      mockRequestRepository.delete.mockResolvedValue({});

      await expect(service.deleteRequest('1')).resolves.not.toThrow();
    });

    it('debería lanzar error si no encuentra la solicitud a eliminar', async () => {
      mockRequestRepository.findOne.mockResolvedValue(null);
      await expect(service.deleteRequest('1')).rejects.toThrow();
    });
  });

  describe('getRequestByUserEmail', () => {
    it('debería retornar solicitudes por correo de usuario', async () => {
      const requests = [{ id: '1', ...requestDto }];
      mockRequestRepository.find.mockResolvedValue(requests);

      const result = await service.getRequestByUserEmail('test@example.com');
      expect(result).toEqual(requests);
    });

    it('debería lanzar error si no hay solicitudes con ese correo', async () => {
      mockRequestRepository.find.mockResolvedValue([]);

      await expect(service.getRequestByUserEmail('test@example.com')).rejects.toThrow();
    });
  });

  describe('getRequestByStatus', () => {
    it('debería retornar solicitudes por estado', async () => {
      const requests = [{ id: '1', ...requestDto }];
      mockRequestRepository.find.mockResolvedValue(requests);

      const result = await service.getRequestByStatus('pendiente');
      expect(result).toEqual(requests);
    });

    it('debería lanzar error si no hay solicitudes con ese estado', async () => {
      mockRequestRepository.find.mockResolvedValue([]);

      await expect(service.getRequestByStatus('pendiente')).rejects.toThrow();
    });
  });
});
