import { Test, TestingModule } from '@nestjs/testing';
import { RequestsService } from './requests.service';
import { Request } from './entities/request.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateRequestDto } from './dto/create-request.dto';
import { NotFoundError } from 'rxjs';

describe('RequestsService', () => {
  let service: RequestsService;
  let repository: Repository<Request>;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestsService,
        {
          provide: getRepositoryToken(Request),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<RequestsService>(RequestsService);
    repository = module.get<Repository<Request>>(getRepositoryToken(Request));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createRequest', () => {
    it('should create and save a new request', async () => {
      const requestDto: CreateRequestDto = { 
        id: '1', 
        user_Document: '12345', 
        date_Request: new Date(), 
        status: 'pending', 
        admin_comment: 'Initial request' 
      };
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(requestDto);
      mockRepository.save.mockResolvedValue(requestDto);

      const result = await service.createRequest(requestDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: requestDto.id } });
      expect(mockRepository.create).toHaveBeenCalledWith(requestDto);
      expect(mockRepository.save).toHaveBeenCalledWith(requestDto);
      expect(result).toEqual(requestDto);
    });

    it('should throw an error if the request already exists', async () => {
      const requestDto: CreateRequestDto = { 
        id: '1', 
        user_Document: '12345', 
        date_Request: new Date(), 
        status: 'pending', 
        admin_comment: 'Initial request' 
      };
      mockRepository.findOne.mockResolvedValue(requestDto);

      await expect(service.createRequest(requestDto)).rejects.toThrow('La solicitud ya existe');
    });
  });

  describe('getAllRequests', () => {
    it('should return all requests', async () => {
      const requests = [{ id: '1', user_Document: '12345' }];
      mockRepository.find.mockResolvedValue(requests);

      const result = await service.getAllRequests();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual(requests);
    });
  });

  describe('getRequestById', () => {
    it('should return a request by id', async () => {
      const request = { id: '1', user_Document: '12345' };
      mockRepository.findOne.mockResolvedValue(request);

      const result = await service.getRequestById('1');

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual(request);
    });

    it('should throw an error if the request is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.getRequestById('1')).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateRequest', () => {
    it('should update and return the updated request', async () => {
      const requestDto: CreateRequestDto = { 
        id: '1', 
        user_Document: '12345', 
        date_Request: new Date(), 
        status: 'pending', 
        admin_comment: 'Updated request' 
      };
      const updatedRequest = { ...requestDto };

      mockRepository.findOne.mockResolvedValue(updatedRequest);
      mockRepository.update.mockResolvedValue(undefined);
      mockRepository.findOne.mockResolvedValue(updatedRequest);

      const result = await service.updateRequest('1', requestDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(mockRepository.update).toHaveBeenCalledWith('1', requestDto);
      expect(result).toEqual(updatedRequest);
    });

    it('should throw an error if the request is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.updateRequest('1', {} as CreateRequestDto)).rejects.toThrow(NotFoundError);
    });
  });

  describe('deleteRequest', () => {
    it('should delete a request', async () => {
      const request = { id: '1', user_Document: '12345' };
      mockRepository.findOne.mockResolvedValue(request);
      mockRepository.delete.mockResolvedValue(undefined);

      await service.deleteRequest('1');

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(mockRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw an error if the request is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteRequest('1')).rejects.toThrow(NotFoundError);
    });
  });

  describe('getRequestByUserDocument', () => {
    it('should return requests by user document', async () => {
      const requests = [{ id: '1', user_Document: '12345' }];
      mockRepository.find.mockResolvedValue(requests);

      const result = await service.getRequestByUserDocument('12345');

      expect(mockRepository.find).toHaveBeenCalledWith({ where: { user_Document: '12345' } });
      expect(result).toEqual(requests);
    });

    it('should throw an error if no requests are found', async () => {
      mockRepository.find.mockResolvedValue([]);

      await expect(service.getRequestByUserDocument('12345')).rejects.toThrow(
        'No se encontraron solicitudes para este documento de usuario',
      );
    });
  });

  describe('getRequestByStatus', () => {
    it('should return requests by status', async () => {
      const requests = [{ id: '1', status: 'pending' }];
      mockRepository.find.mockResolvedValue(requests);

      const result = await service.getRequestByStatus('pending');

      expect(mockRepository.find).toHaveBeenCalledWith({ where: { status: 'pending' } });
      expect(result).toEqual(requests);
    });

    it('should throw an error if no requests are found', async () => {
      mockRepository.find.mockResolvedValue([]);

      await expect(service.getRequestByStatus('pending')).rejects.toThrow(
        'No se encontraron solicitudes con este estado',
      );
    });
  });
});