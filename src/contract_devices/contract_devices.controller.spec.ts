import { Test, TestingModule } from '@nestjs/testing';
import { ContractDevicesController } from './contract_devices.controller';
import { ContractDevicesService } from './contract_devices.service';
import { CreateContractDeviceDto } from './dto/create-contract_device.dto';
import { ContractDevice } from './entities/contract_device.entity';

describe('ContractDevicesController', () => {
  let controller: ContractDevicesController;
  let service: jest.Mocked<ContractDevicesService>;

  beforeEach(async () => {
    const mockService: Partial<ContractDevicesService> = {
      createContractDevice: jest.fn(),
      getAllContractDevices: jest.fn(),
      getContractDeviceById: jest.fn(),
      updateContractDevice: jest.fn(),
      deleteContractDevice: jest.fn(),
      getContractDevicesByDeviceName: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContractDevicesController],
      providers: [
        {
          provide: ContractDevicesService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ContractDevicesController>(ContractDevicesController);
    service = module.get(ContractDevicesService);
  });

  describe('createContractDevice', () => {
    it('should call service.createContractDevice with dto and quantity', async () => {
      const dto: CreateContractDeviceDto = { deviceName: 'Router', contract_id: 'c1', device_id: 'd1', delivey_status: 'Pending' };
      const result: ContractDevice[] = [{ id: 'cd1', deviceName: 'Router' } as ContractDevice];

      service.createContractDevice.mockResolvedValue(result);

      const response = await controller.createContractDevice(dto, 1);
      expect(response).toEqual(result);
      expect(service.createContractDevice).toHaveBeenCalledWith(dto, 1);
    });
  });

  describe('getAllContractDevices', () => {
    it('should return all contract devices', async () => {
      const result: ContractDevice[] = [{ id: 'cd1' } as ContractDevice];
      service.getAllContractDevices.mockResolvedValue(result);

      const response = await controller.getAllContractDevices();
      expect(response).toEqual(result);
    });
  });

  describe('getContractDevicesById', () => {
    it('should return contract device by ID', async () => {
      const id = 'uuid';
      const result = { id } as ContractDevice;

      service.getContractDeviceById.mockResolvedValue(result);
      const response = await controller.getContractDevicesById(id);

      expect(response).toEqual(result);
      expect(service.getContractDeviceById).toHaveBeenCalledWith(id);
    });
  });

  describe('updateContractDevices', () => {
    it('should update contract device', async () => {
      const id = 'uuid';
      const dto: CreateContractDeviceDto = { deviceName: 'Switch', contract_id: 'c2', device_id: 'd2', delivey_status: 'Delivered' };
      const result = { id, ...dto } as ContractDevice;

      service.updateContractDevice.mockResolvedValue(result);
      const response = await controller.updateContractDevices(id, dto);

      expect(response).toEqual(result);
      expect(service.updateContractDevice).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('deleteContractDevice', () => {
    it('should call delete method with correct ID', async () => {
      const id = 'uuid';
      service.deleteContractDevice.mockResolvedValue(undefined);

      await controller.deleteContractDevice(id);
      expect(service.deleteContractDevice).toHaveBeenCalledWith(id);
    });
  });

  describe('getContractDevicesByDeviceName', () => {
    it('should return contract devices filtered by device name', async () => {
      const name = 'Router';
      const result: ContractDevice[] = [{ id: 'cd1', deviceName: name } as ContractDevice];

      service.getContractDevicesByDeviceName.mockResolvedValue(result);
      const response = await controller.getContractDevicesByDeviceName(name);

      expect(response).toEqual(result);
      expect(service.getContractDevicesByDeviceName).toHaveBeenCalledWith(name);
    });
  });
});
