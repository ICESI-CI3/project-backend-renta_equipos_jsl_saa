import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserDTO } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { Request } from '../requests/entities/request.entity';
import { RequestDevice } from '../request_devices/entities/request_device.entity';
import { Contract } from '../contract/entities/contract.entity';
import { ContractDevice } from '../contract_devices/entities/contract_device.entity';
import { Device } from '../devices/entities/device.entity';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;
  let requestRepository: Repository<Request>;
  let requestDeviceRepository: Repository<RequestDevice>;
  let contractRepository: Repository<Contract>;
  let contractDeviceRepository: Repository<ContractDevice>;
  let deviceRepository: Repository<Device>;

  const mockUser = {
    id: 'uuid-123',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword',
    cellphone: '1234567890',
    address: '123 Street',
    role: 'user',
  };

  const mockUserDTO: UserDTO = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'Password1',
    cellphone: '1234567890',
    address: '123 Street',
  };

  const mockPagination = { limit: 10, offset: 0 };

  const mockRepo = () => ({
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useFactory: mockRepo },
        { provide: getRepositoryToken(Request), useFactory: mockRepo },
        { provide: getRepositoryToken(RequestDevice), useFactory: mockRepo },
        { provide: getRepositoryToken(Contract), useFactory: mockRepo },
        { provide: getRepositoryToken(ContractDevice), useFactory: mockRepo },
        { provide: getRepositoryToken(Device), useFactory: mockRepo },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get(getRepositoryToken(User));
    requestRepository = module.get(getRepositoryToken(Request));
    requestDeviceRepository = module.get(getRepositoryToken(RequestDevice));
    contractRepository = module.get(getRepositoryToken(Contract));
    contractDeviceRepository = module.get(getRepositoryToken(ContractDevice));
    deviceRepository = module.get(getRepositoryToken(Device));
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      userRepository.findOne = jest.fn().mockResolvedValue(null);
      userRepository.create = jest.fn().mockReturnValue(mockUser);
      userRepository.save = jest.fn().mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve('hashedPassword'));

      const result = await service.createUser({ ...mockUserDTO });
      expect(result).toEqual(mockUser);
    });

    it('should throw if user already exists', async () => {
      userRepository.findOne = jest.fn().mockResolvedValue(mockUser);

      await expect(service.createUser(mockUserDTO)).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });

  describe('getAllUsers', () => {
    it('should return list of users', async () => {
      userRepository.find = jest.fn().mockResolvedValue([mockUser]);

      const result = await service.getAllUsers(mockPagination);
      expect(result).toEqual([mockUser]);
    });
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      userRepository.findOne = jest.fn().mockResolvedValue(mockUser);

      const result = await service.getUserById('uuid-123');
      expect(result).toEqual(mockUser);
    });

    it('should throw if user not found', async () => {
      userRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.getUserById('uuid-123')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getUserByEmail', () => {
    it('should return user by email', async () => {
      userRepository.findOne = jest.fn().mockResolvedValue(mockUser);

      const result = await service.getUserByEmail('test@example.com');
      expect(result).toEqual(mockUser);
    });

    it('should throw if email not found', async () => {
      userRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.getUserByEmail('invalid@example.com')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateUser', () => {
    it('should update user info', async () => {
      userRepository.update = jest.fn().mockResolvedValue({ affected: 1 });
      userRepository.findOne = jest.fn().mockResolvedValue(mockUser);

      const result = await service.updateUser('uuid-123', mockUserDTO);
      expect(result).toEqual(mockUser);
    });

    it('should throw if user not found', async () => {
      userRepository.update = jest.fn().mockResolvedValue({ affected: 0 });

      await expect(service.updateUser('uuid-123', mockUserDTO)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteUser', () => {
    it('should delete user', async () => {
      userRepository.delete = jest.fn().mockResolvedValue({ affected: 1 });

      await expect(service.deleteUser('uuid-123')).resolves.toBeUndefined();
    });

    it('should throw if user not found', async () => {
      userRepository.delete = jest.fn().mockResolvedValue({ affected: 0 });

      await expect(service.deleteUser('uuid-123')).rejects.toThrow(NotFoundException);
    });
  });

  describe('acceptRequest', () => {
    it('should accept a valid request and create contract', async () => {
      const mockRequest = {
        id: 'req-1',
        user_email: mockUser.email,
        date_Request: new Date(),
        status: 'pending'
      };

      const contract = { id: 'contract-1' };

      requestRepository.findOne = jest.fn().mockResolvedValue(mockRequest);
      userRepository.findOne = jest.fn().mockResolvedValue(mockUser);
      contractRepository.create = jest.fn().mockReturnValue(contract);
      contractRepository.save = jest.fn().mockResolvedValue(contract);
      requestDeviceRepository.find = jest.fn().mockResolvedValue([{ device_id: 'dev-1', device_name: 'Device 1' }]);
      contractDeviceRepository.save = jest.fn();
      deviceRepository.update = jest.fn();

      await service.acceptRequest('req-1');

      expect(contractRepository.save).toHaveBeenCalled();
    });

    it('should throw if request not found', async () => {
      requestRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.acceptRequest('req-1')).rejects.toThrow(NotFoundException);
    });

    it('should throw if user not found', async () => {
      requestRepository.findOne = jest.fn().mockResolvedValue({ id: 'req-1', user_email: 'x@y.com' });
      userRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.acceptRequest('req-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('rejectRequest', () => {
    it('should reject and delete request', async () => {
      requestRepository.findOne = jest.fn().mockResolvedValue({ id: 'req-1' });
      requestDeviceRepository.find = jest.fn().mockResolvedValue([{ id: 'rd1' }]);
      requestDeviceRepository.delete = jest.fn();
      requestRepository.delete = jest.fn();

      await service.rejectRequest('req-1');

      expect(requestDeviceRepository.delete).toHaveBeenCalledWith('rd1');
      expect(requestRepository.delete).toHaveBeenCalledWith('req-1');
    });

    it('should throw if request not found', async () => {
      requestRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.rejectRequest('req-1')).rejects.toThrow(NotFoundException);
    });
  });
});
