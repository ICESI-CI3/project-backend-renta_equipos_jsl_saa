import { Test, TestingModule } from '@nestjs/testing';
import { ContractsController } from './contracts.controller';
import { ContractsService } from './contracts.service';
import { Contract } from './entities/contract.entity';

describe('ContractController', () => {
  let controller: ContractsController;
  let service: ContractsService;

  const mockContract: Contract = {
    id: '1',
    user_email: 'test@example.com',
    date_Start: new Date(),
    date_Finish: new Date(),
    monthly_Value: 1000,
    status: 'Pending',
    client_signature: 'Signed',
    request_id: 'req-123'
  };

  const mockService = {
    createContract: jest.fn().mockResolvedValue(mockContract),
    getAllContracts: jest.fn().mockResolvedValue([mockContract]),
    getContractById: jest.fn().mockResolvedValue(mockContract),
    updateContract: jest.fn().mockResolvedValue(mockContract),
    deleteContract: jest.fn().mockResolvedValue(undefined),
    getContractByUserEmail: jest.fn().mockResolvedValue([mockContract]),
    getContractByStatus: jest.fn().mockResolvedValue([mockContract])
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContractsController],
      providers: [
        {
          provide: ContractsService,
          useValue: mockService
        }
      ]
    }).compile();

    controller = module.get<ContractsController>(ContractsController);
    service = module.get<ContractsService>(ContractsService);
  });

  it('should create a contract', async () => {
    const result = await controller.createContract(mockContract);
    expect(result).toEqual(mockContract);
  });

  it('should get all contracts', async () => {
    const result = await controller.getAllContracts();
    expect(result).toEqual([mockContract]);
  });

  it('should get contract by id', async () => {
    const result = await controller.getContractById('1');
    expect(result).toEqual(mockContract);
  });

  it('should update contract', async () => {
    const result = await controller.updateContract('1', mockContract);
    expect(result).toEqual(mockContract);
  });

  it('should delete contract', async () => {
    const result = await controller.deleteContract('1');
    expect(result).toEqual({ message: 'Contrato eliminado exitosamente' });
  });

  it('should get contract by user email', async () => {
    const result = await controller.getContractsByUserEmail('test@example.com');
    expect(result).toEqual([mockContract]);
  });

  it('should get contract by status', async () => {
    const result = await controller.getContractsByStatus('Pending');
    expect(result).toEqual([mockContract]);
  });
});
