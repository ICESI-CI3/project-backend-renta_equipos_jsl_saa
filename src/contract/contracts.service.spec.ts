import { Test, TestingModule } from '@nestjs/testing';
import { ContractsService } from './contracts.service';
import { Contract } from './entities/contract.entity';
import { User } from '../users/entities/user.entity';
import { Request } from '../requests/entities/request.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('ContractsService', () => {
  let service: ContractsService;
  let contractRepo: jest.Mocked<Repository<Contract>>;
  let userRepo: jest.Mocked<Repository<User>>;
  let requestRepo: jest.Mocked<Repository<Request>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContractsService,
        { provide: getRepositoryToken(Contract), useValue: createMockRepo() },
        { provide: getRepositoryToken(User), useValue: createMockRepo() },
        { provide: getRepositoryToken(Request), useValue: createMockRepo() },
      ],
    }).compile();

    service = module.get<ContractsService>(ContractsService);
    contractRepo = module.get(getRepositoryToken(Contract));
    userRepo = module.get(getRepositoryToken(User));
    requestRepo = module.get(getRepositoryToken(Request));
  });

  const createMockRepo = <T extends Record<string, any>>() => ({
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  }) as unknown as jest.Mocked<Repository<T>>;

  describe('createContract', () => {
    it('should create and return a contract if user and request exist and request is accepted', async () => {
      const contract: Contract = { id: '1', user_email: 'test@mail.com', request_id: 'r1', status: 'active' } as Contract;

      userRepo.findOne.mockResolvedValue({} as User);
      requestRepo.findOne
        .mockResolvedValueOnce({} as Request) // for requestExists
        .mockResolvedValueOnce({ status: 'accepted' } as Request); // for requestAccepted

      contractRepo.create.mockReturnValue(contract);
      contractRepo.save.mockResolvedValue(contract);

      const result = await service.createContract(contract);
      expect(result).toEqual(contract);
    });

    it('should throw if user does not exist', async () => {
      userRepo.findOne.mockResolvedValue(null);
      await expect(service.createContract({ user_email: 'x' } as Contract)).rejects.toThrow('El usuario no existe');
    });

    it('should throw if request does not exist', async () => {
      userRepo.findOne.mockResolvedValue({} as User);
      requestRepo.findOne.mockResolvedValueOnce(null);

      await expect(service.createContract({ request_id: 'r1', user_email: 'x' } as Contract)).rejects.toThrow(
        'La solicitud no existe'
      );
    });

    it('should throw if request not accepted', async () => {
      userRepo.findOne.mockResolvedValue({} as User);
      requestRepo.findOne
        .mockResolvedValueOnce({} as Request) // requestExists
        .mockResolvedValueOnce(null); // requestAccepted

      await expect(service.createContract({ request_id: 'r1', user_email: 'x' } as Contract)).rejects.toThrow(
        'La solicitud no ha sido aceptada'
      );
    });
  });

  describe('getAllContracts', () => {
    it('should return all contracts', async () => {
      const contracts = [{ id: '1' }] as Contract[];
      contractRepo.find.mockResolvedValue(contracts);

      const result = await service.getAllContracts();
      expect(result).toEqual(contracts);
    });
  });

  describe('getContractById', () => {
    it('should return contract by id', async () => {
      const contract = { id: '1' } as Contract;
      contractRepo.findOne.mockResolvedValue(contract);

      const result = await service.getContractById('1');
      expect(result).toEqual(contract);
    });

    it('should throw if contract not found', async () => {
      contractRepo.findOne.mockResolvedValue(null);
      await expect(service.getContractById('1')).rejects.toThrow('El contrato no existe');
    });
  });

  describe('updateContract', () => {
    it('should update and return updated contract', async () => {
      const contract = { id: '1', user_email: 'test@mail.com' } as Contract;

      contractRepo.findOne
        .mockResolvedValueOnce(contract) // check existence
        .mockResolvedValueOnce(contract); // fetch updated

      const result = await service.updateContract('1', contract);
      expect(result).toEqual(contract);
    });

    it('should throw if contract not found on update', async () => {
      contractRepo.findOne.mockResolvedValue(null);
      await expect(service.updateContract('1', {} as Contract)).rejects.toThrow('El contrato no existe');
    });
  });

  describe('deleteContract', () => {
    it('should delete a contract if exists', async () => {
      contractRepo.findOne.mockResolvedValue({ id: '1' } as Contract);
      await service.deleteContract('1');
      expect(contractRepo.delete).toHaveBeenCalledWith('1');
    });

    it('should throw if contract does not exist', async () => {
      contractRepo.findOne.mockResolvedValue(null);
      await expect(service.deleteContract('1')).rejects.toThrow('El contrato no existe');
    });
  });

  describe('getContractByUserEmail', () => {
    it('should return contracts by user email', async () => {
      const contracts = [{ id: '1' }] as Contract[];
      contractRepo.find.mockResolvedValue(contracts);

      const result = await service.getContractByUserEmail('user@mail.com');
      expect(result).toEqual(contracts);
    });

    it('should throw if no contracts found', async () => {
      contractRepo.find.mockResolvedValue([]);
      await expect(service.getContractByUserEmail('none@mail.com')).rejects.toThrow(
        'No se encontraron contratos para este usuario'
      );
    });
  });

  describe('getContractByStatus', () => {
    it('should return contracts by status', async () => {
      const contracts = [{ id: '1', status: 'pending' }] as Contract[];
      contractRepo.find.mockResolvedValue(contracts);

      const result = await service.getContractByStatus('pending');
      expect(result).toEqual(contracts);
    });

    it('should throw if no contracts found with status', async () => {
      contractRepo.find.mockResolvedValue([]);
      await expect(service.getContractByStatus('none')).rejects.toThrow(
        'No se encontraron contratos con este estado'
      );
    });
  });
});
