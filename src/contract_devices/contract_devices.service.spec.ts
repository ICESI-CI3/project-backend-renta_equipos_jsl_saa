import { Test, TestingModule } from '@nestjs/testing';
import { ContractDevicesService } from './contract_devices.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ContractDevice } from './entities/contract_device.entity';
import { Device } from '../devices/entities/device.entity';
import { Contract } from '../contract/entities/contract.entity';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { CreateContractDeviceDto } from './dto/create-contract_device.dto';

describe('ContractDevicesService', () => {
  let service: ContractDevicesService;
  let contractDeviceRepo: Repository<ContractDevice>;
  let deviceRepo: Repository<Device>;
  let contractRepo: Repository<Contract>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContractDevicesService,
        {
          provide: getRepositoryToken(ContractDevice),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Device),
          useValue: {
            find: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Contract),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ContractDevicesService>(ContractDevicesService);
    contractDeviceRepo = module.get(getRepositoryToken(ContractDevice));
    deviceRepo = module.get(getRepositoryToken(Device));
    contractRepo = module.get(getRepositoryToken(Contract));
  });

  const mockContractDeviceRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockDeviceRepo = {
    find: jest.fn() as jest.Mock<Promise<Device[]>, [any]>,
    update: jest.fn(),
  };

  const mockContractRepo = {
      findOne: jest.fn(),
    };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContractDevicesService,
        { provide: getRepositoryToken(ContractDevice), useValue: mockContractDeviceRepo },
        { provide: getRepositoryToken(Device), useValue: mockDeviceRepo },
        { provide: getRepositoryToken(Contract), useValue: mockContractRepo },
      ],
    }).compile();

    service = module.get<ContractDevicesService>(ContractDevicesService);
    contractDeviceRepo = module.get(getRepositoryToken(ContractDevice));
    deviceRepo = module.get(getRepositoryToken(Device));
    contractRepo = module.get(getRepositoryToken(Contract));
  });

  afterEach(() => jest.clearAllMocks());

  describe('createContractDevice', () => {
    it('should assign devices to a contract', async () => {
      const dto: CreateContractDeviceDto = {
        contract_id: 'contract1',
        device_name: 'DeviceA',
        device_id: 'device1',
        delivery_status: 'Pending',
      };
      const devices = [{ id: '1', name: 'DeviceA', status: 'Disponible' }];
      const contract = { id: 'contract1' };

      (deviceRepo.find as jest.Mock).mockResolvedValue([...devices]);
      (contractRepo.findOne as jest.Mock).mockResolvedValue(contract);
      (contractDeviceRepo.create as jest.Mock).mockReturnValue({});
      (contractDeviceRepo.save as jest.Mock).mockResolvedValue({});

      const result = await service.createContractDevice(dto, 1);
      expect(result).toBe('Dispositivos asignados correctamente al contrato');
      expect(deviceRepo.update).toHaveBeenCalledWith('1', { status: 'Asignado' });
    });

    it('should throw if not enough devices', async () => {
      (deviceRepo.find as jest.Mock).mockResolvedValue([]);
      const dto: CreateContractDeviceDto = { 
        contract_id: 'x', 
        device_name: 'DeviceA', 
        device_id: 'device1', 
        delivery_status: 'Pending' 
      };
      await expect(service.createContractDevice(dto, 2)).rejects.toThrow(BadRequestException);
    });

    it('should throw if contract not found', async () => {
      (deviceRepo.find as jest.Mock).mockResolvedValue([{ id: '1', name: 'DeviceA' }]);
      (contractRepo.findOne as jest.Mock).mockResolvedValue(null);
      const dto: CreateContractDeviceDto = { 
        contract_id: 'x', 
        device_name: 'DeviceA', 
        device_id: 'device1', 
        delivery_status: 'Pending' 
      };
      await expect(service.createContractDevice(dto, 1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getAllContractDevices', () => {
    it('should return all contract devices', async () => {
      const mockData = [{ id: '1' }, { id: '2' }];
      (contractDeviceRepo.find as jest.Mock).mockResolvedValue(mockData);
      expect(await service.getAllContractDevices()).toEqual(mockData);
    });
  });

  describe('getContractDeviceById', () => {
    it('should return a contract device', async () => {
      const contractDevice = { id: '1' };
      (contractDeviceRepo.findOne as jest.Mock).mockResolvedValue(contractDevice);
      (contractDeviceRepo.findOne as jest.Mock).mockResolvedValue(null);
    });

    it('should throw if not found', async () => {
      (contractDeviceRepo.findOne as jest.Mock).mockResolvedValue(null);
      await expect(service.getContractDeviceById('x')).rejects.toThrow();
    });
  });

  describe('updateContractDevice', () => {
    it('should update and return the contract device', async () => {
      const dto = { contract_id: '1', device_name: 'DeviceX' };
      (contractDeviceRepo.findOne as jest.Mock)
        .mockResolvedValueOnce({ id: '1' }) // exists
        .mockResolvedValueOnce({ id: '1', device_name: 'DeviceX' }); // after update

      const updateDto: CreateContractDeviceDto = { 
        contract_id: '1', 
        device_name: 'DeviceX', 
        device_id: 'device1', 
        delivery_status: 'Pending' 
      };
      const result = await service.updateContractDevice('1', updateDto);
      expect(result).toEqual({ id: '1', device_name: 'DeviceX' });
    });

    it('should throw if not found', async () => {
      (contractDeviceRepo.findOne as jest.Mock).mockResolvedValue(null);
      await expect(service.updateContractDevice('x', { 
        contract_id: '1', 
        device_name: 'X', 
        device_id: 'device1', 
        delivery_status: 'Pending' 
      })).rejects.toThrow();
    });
  });

  describe('deleteContractDevice', () => {
    it('should delete a contract device', async () => {
      (contractDeviceRepo.findOne as jest.Mock).mockResolvedValue({ id: '1' });
      await service.deleteContractDevice('1');
      expect(contractDeviceRepo.delete).toHaveBeenCalledWith('1');
    });

    it('should throw if not found', async () => {
      (contractDeviceRepo.findOne as jest.Mock).mockResolvedValue(null);
      await expect(service.deleteContractDevice('x')).rejects.toThrow();
    });
  });

  describe('getContractDevicesByDeviceName', () => {
    it('should return contract devices by name', async () => {
      const results = [{ id: '1', device_name: 'DeviceA' }];
      (contractDeviceRepo.find as jest.Mock).mockResolvedValue(results);
      expect(await service.getContractDevicesByDeviceName('DeviceA')).toEqual(results);
    });

    it('should throw if none found', async () => {
      (contractDeviceRepo.find as jest.Mock).mockResolvedValue([]);
      await expect(service.getContractDevicesByDeviceName('Unknown')).rejects.toThrow();
    });
  });
});
