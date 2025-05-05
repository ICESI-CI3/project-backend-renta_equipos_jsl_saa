import { Test, TestingModule } from '@nestjs/testing';
import { ContractDevicesService } from './contract_devices.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ContractDevice } from './entities/contract_device.entity';
import { Device } from '../devices/entities/device.entity';
import { Contract } from '../contract/entities/contract.entity';
import { Repository } from 'typeorm';

describe('ContractDevicesService', () => {
  let service: ContractDevicesService;
  let contractDeviceRepo: jest.Mocked<Repository<ContractDevice>>;
  let deviceRepo: jest.Mocked<Repository<Device>>;
  let contractRepo: jest.Mocked<Repository<Contract>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContractDevicesService,
        {
          provide: getRepositoryToken(ContractDevice),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Device),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Contract),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ContractDevicesService>(ContractDevicesService);
    contractDeviceRepo = module.get(getRepositoryToken(ContractDevice));
    deviceRepo = module.get(getRepositoryToken(Device));
    contractRepo = module.get(getRepositoryToken(Contract));
  });

  describe('createContractDevice', () => {
    it('should throw if not enough devices are available', async () => {
      jest.spyOn(deviceRepo, 'find').mockResolvedValue([]);
      const dto = { deviceName: 'Router', contract_id: '1', device_id: 'd1', delivey_status: 'Pending' };
      await expect(service.createContractDevice(dto, 2)).rejects.toThrow(
        /No hay suficientes dispositivos disponibles/
      );
    });

    it('should throw if contract not found', async () => {
      jest.spyOn(deviceRepo, 'find').mockResolvedValue([{ id: 'd1', name: 'Router', status: 'Disponible' }] as Device[]);
      jest.spyOn(contractRepo, 'findOne').mockResolvedValue(null);
      const dto = { deviceName: 'Router', contract_id: '1', device_id: 'd1', delivey_status: 'Pending' };
      await expect(service.createContractDevice(dto, 1)).rejects.toThrow(
        /El contrato especificado no existe/
      );
    });

    it('should create devices and change status', async () => {
      const device = { id: 'd1', name: 'Router', status: 'Disponible' } as Device;
      const contract = { id: 'c1' } as Contract;
      const savedContractDevice = { id: 'cd1', deviceName: 'Router' } as ContractDevice;

      jest.spyOn(deviceRepo, 'find').mockResolvedValue([device]);
      jest.spyOn(contractRepo, 'findOne').mockResolvedValue(contract);
      jest.spyOn(contractDeviceRepo, 'create').mockReturnValue(savedContractDevice);
      jest.spyOn(contractDeviceRepo, 'save').mockResolvedValue(savedContractDevice);
      jest.spyOn(deviceRepo, 'save').mockResolvedValue({ 
        ...device, 
        status: 'Asignado', 
        checkSlug: jest.fn() 
      });

      const dto = { deviceName: 'Router', contract_id: 'c1', device_id: 'd1', delivey_status: 'Pending' };
      const result = await service.createContractDevice(dto, 1);

      await service.createContractDevice({ deviceName: 'Router', contract_id: 'c1', device_id: 'd1', delivey_status: 'Pending' }, 1);

      expect(result).toEqual([savedContractDevice]);
    });
  });

  describe('getAllContractDevices', () => {
    it('should return all contract devices', async () => {
      const devices = [{ id: 'cd1' }] as ContractDevice[];
      jest.spyOn(contractDeviceRepo, 'find').mockResolvedValue(devices);

      const result = await service.getAllContractDevices();
      expect(result).toEqual(devices);
    });
  });

  describe('getContractDeviceById', () => {
    it('should return a contract device by ID', async () => {
      const device = { id: 'cd1' } as ContractDevice;
      jest.spyOn(contractDeviceRepo, 'findOne').mockResolvedValue(device);

      const result = await service.getContractDeviceById('cd1');
      expect(result).toEqual(device);
    });

    it('should throw if not found', async () => {
      jest.spyOn(contractDeviceRepo, 'findOne').mockResolvedValue(null);

      await expect(service.getContractDeviceById('cd1')).rejects.toThrow(/no existe/i);
    });
  });

  describe('updateContractDevice', () => {
    it('should throw if contract device not found', async () => {
      jest.spyOn(contractDeviceRepo, 'findOne').mockResolvedValueOnce(null);

      await expect(service.updateContractDevice('cd1', {} as any)).rejects.toThrow(/no existe/i);
    });

    it('should throw if updated device is null', async () => {
      jest.spyOn(contractDeviceRepo, 'findOne').mockResolvedValueOnce({ id: 'cd1' } as ContractDevice);
      jest.spyOn(contractDeviceRepo, 'update').mockResolvedValue({} as any);
      jest.spyOn(contractDeviceRepo, 'findOne').mockResolvedValueOnce(null);

      await expect(service.updateContractDevice('cd1', {} as any)).rejects.toThrow(/actualizado/);
    });

    it('should update contract device', async () => {
      const updatedDevice = { id: 'cd1', deviceName: 'New' } as ContractDevice;

      jest.spyOn(contractDeviceRepo, 'findOne').mockResolvedValueOnce({ id: 'cd1' } as ContractDevice);
      jest.spyOn(contractDeviceRepo, 'update').mockResolvedValue({} as any);
      jest.spyOn(contractDeviceRepo, 'findOne').mockResolvedValueOnce(updatedDevice);

      const result = await service.updateContractDevice('cd1', {} as any);
      expect(result).toEqual(updatedDevice);
    });
  });

  describe('deleteContractDevice', () => {
    it('should throw if not found', async () => {
      jest.spyOn(contractDeviceRepo, 'findOne').mockResolvedValue(null);

      await expect(service.deleteContractDevice('cd1')).rejects.toThrow(/no existe/i);
    });

    it('should delete if exists', async () => {
      jest.spyOn(contractDeviceRepo, 'findOne').mockResolvedValue({ id: 'cd1' } as ContractDevice);
      const deleteSpy = jest.spyOn(contractDeviceRepo, 'delete').mockResolvedValue({} as any);

      await service.deleteContractDevice('cd1');
      expect(deleteSpy).toHaveBeenCalledWith('cd1');
    });
  });

  describe('getContractDevicesByDeviceName', () => {
    it('should return contract devices', async () => {
      const resultList = [{ id: 'cd1' }] as ContractDevice[];
      jest.spyOn(contractDeviceRepo, 'find').mockResolvedValue(resultList);

      const result = await service.getContractDevicesByDeviceName('Router');
      expect(result).toEqual(resultList);
    });

    it('should throw if none found', async () => {
      jest.spyOn(contractDeviceRepo, 'find').mockResolvedValue([]);

      await expect(service.getContractDevicesByDeviceName('Router')).rejects.toThrow(/no hay contratos/i);
    });
  });
});
