import { Test, TestingModule } from '@nestjs/testing';
import { ContractsService } from './contracts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Contract } from './entities/contract.entity';
import { User } from '../users/entities/user.entity';
import { Request } from '../requests/entities/request.entity';
import { Repository } from 'typeorm';

const mockContract = {
  id: '1',
  user_email: 'test@example.com',
  date_Start: new Date(),
  date_Finish: new Date(),
  monthly_Value: 1000,
  status: 'Pending',
  contract: 'Test contract content',
  client_signature: 'Signed',
  request_id: 'req-123'
};

describe('ContractService', () => {
  let service: ContractsService;
  let contractRepo: Repository<Contract>;
  let userRepo: Repository<User>;
  let requestRepo: Repository<Request>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContractsService,
        {
          provide: getRepositoryToken(Contract),
          useValue: {
            create: jest.fn().mockReturnValue(mockContract),
            save: jest.fn().mockResolvedValue(mockContract),
            find: jest.fn().mockResolvedValue([mockContract]),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
          }
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockResolvedValue({ email: mockContract.user_email })
          }
        },
        {
          provide: getRepositoryToken(Request),
          useValue: {
            findOne: jest.fn().mockImplementation(({ where }) => {
              if (where.status === 'accepted') return { id: mockContract.request_id, status: 'accepted' };
              return { id: mockContract.request_id };
            })
          }
        }
      ]
    }).compile();

    service = module.get<ContractsService>(ContractsService);
    contractRepo = module.get(getRepositoryToken(Contract));
    userRepo = module.get(getRepositoryToken(User));
    requestRepo = module.get(getRepositoryToken(Request));
  });

  it('should create a contract', async () => {
    const result = await service.createContract(mockContract as Contract);
    expect(result).toEqual(mockContract);
  });

  it('should return all contracts', async () => {
    const result = await service.getAllContracts();
    expect(result).toEqual([mockContract]);
  });

  it('should return contract by id', async () => {
    jest.spyOn(contractRepo, 'findOne').mockResolvedValue(mockContract as Contract);
    const result = await service.getContractById('1');
    expect(result).toEqual(mockContract);
  });

  it('should throw if contract not found by id', async () => {
    jest.spyOn(contractRepo, 'findOne').mockResolvedValue(null);
    await expect(service.getContractById('1')).rejects.toThrow('El contrato no existe');
  });

  it('should delete contract', async () => {
    jest.spyOn(contractRepo, 'findOne').mockResolvedValue(mockContract as Contract);
    const result = await service.deleteContract('1');
    expect(contractRepo.delete).toHaveBeenCalledWith('1');
  });
});
