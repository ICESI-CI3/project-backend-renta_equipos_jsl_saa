import { Test, TestingModule } from '@nestjs/testing';
import { ContractsController } from './contracts.controller';
import { ContractsService } from './contracts.service';
import { Contract } from './entities/contract.entity';

describe('ContractsController', () => {
  let controller: ContractsController;
  let service: ContractsService;

  const mockContract: Contract = {
    id: '1',
    user_email: 'test@example.com',
    request_id: 'req-1',
    status: 'accepted',
    date_start: '2023-01-01',
    date_finish: '2023-12-31',
    client_signature: 'signature123',
  };

  const mockContractsService = {
    createContract: jest.fn().mockResolvedValue(mockContract),
    getAllContracts: jest.fn().mockResolvedValue([mockContract]),
    getContractById: jest.fn().mockResolvedValue(mockContract),
    updateContract: jest.fn().mockResolvedValue(mockContract),
    deleteContract: jest.fn().mockResolvedValue(undefined),
    getContractByUserEmail: jest.fn().mockResolvedValue([mockContract]),
    getContractByStatus: jest.fn().mockResolvedValue([mockContract]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContractsController],
      providers: [
        {
          provide: ContractsService,
          useValue: mockContractsService,
        },
      ],
    }).compile();

    controller = module.get<ContractsController>(ContractsController);
    service = module.get<ContractsService>(ContractsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a contract', async () => {
    const result = await controller.createContract(mockContract);
    expect(result).toEqual(mockContract);
    expect(service.createContract).toHaveBeenCalledWith(mockContract);
  });

  it('should get all contracts', async () => {
    const result = await controller.getAllContracts();
    expect(result).toEqual([mockContract]);
  });

  it('should get contract by id', async () => {
    const result = await controller.getContractById('1');
    expect(result).toEqual(mockContract);
    expect(service.getContractById).toHaveBeenCalledWith('1');
  });

  it('should update a contract', async () => {
    const result = await controller.updateContract('1', mockContract);
    expect(result).toEqual(mockContract);
    expect(service.updateContract).toHaveBeenCalledWith('1', mockContract);
  });

  it('should delete a contract', async () => {
    const result = await controller.deleteContract('1');
    expect(result).toEqual({ message: 'Contrato eliminado exitosamente' });
    expect(service.deleteContract).toHaveBeenCalledWith('1');
  });

  it('should get contracts by user email', async () => {
    const result = await controller.getContractsByUserEmail('test@example.com');
    expect(result).toEqual([mockContract]);
    expect(service.getContractByUserEmail).toHaveBeenCalledWith('test@example.com');
  });

  it('should get contracts by status', async () => {
    const result = await controller.getContractsByStatus('accepted');
    expect(result).toEqual([mockContract]);
    expect(service.getContractByStatus).toHaveBeenCalledWith('accepted');
  });

  it('should throw if service throws (createContract)', async () => {
    jest.spyOn(service, 'createContract').mockRejectedValue(new Error('Create error'));
    await expect(controller.createContract(mockContract)).rejects.toThrow('Create error');
  });

  it('should throw if service throws (getAllContracts)', async () => {
    jest.spyOn(service, 'getAllContracts').mockRejectedValue(new Error('Get all error'));
    await expect(controller.getAllContracts()).rejects.toThrow('Get all error');
  });

  it('should throw if service throws (getContractById)', async () => {
    jest.spyOn(service, 'getContractById').mockRejectedValue(new Error('Not found'));
    await expect(controller.getContractById('1')).rejects.toThrow('Not found');
  });

  it('should throw if service throws (updateContract)', async () => {
    jest.spyOn(service, 'updateContract').mockRejectedValue(new Error('Update error'));
    await expect(controller.updateContract('1', mockContract)).rejects.toThrow('Update error');
  });

  it('should throw if service throws (deleteContract)', async () => {
    jest.spyOn(service, 'deleteContract').mockRejectedValue(new Error('Delete error'));
    await expect(controller.deleteContract('1')).rejects.toThrow('Delete error');
  });

  it('should throw if service throws (getContractByUserEmail)', async () => {
    jest.spyOn(service, 'getContractByUserEmail').mockRejectedValue(new Error('User email error'));
    await expect(controller.getContractsByUserEmail('test@example.com')).rejects.toThrow('User email error');
  });

  it('should throw if service throws (getContractByStatus)', async () => {
    jest.spyOn(service, 'getContractByStatus').mockRejectedValue(new Error('Status error'));
    await expect(controller.getContractsByStatus('accepted')).rejects.toThrow('Status error');
  });
});
