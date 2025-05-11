import { Test, TestingModule } from '@nestjs/testing';
import { ContractDevicesController } from './contract_devices.controller';
import { ContractDevicesService } from './contract_devices.service';
import { CreateContractDeviceDto } from './dto/create-contract_device.dto';
import { ContractDevice } from './entities/contract_device.entity';

describe('ContractDevicesController', () => {
  let controller: ContractDevicesController;
  let service: ContractDevicesService;

  const mockContractDevice: ContractDevice = {
    id: '1',
    contract_id: '123',
    device_id: 'device-123',
    device_name: 'DeviceX',
    delivery_status: 'pending',
  };

  const mockService = {
    createContractDevice: jest.fn().mockResolvedValue('Dispositivos asignados correctamente al contrato'),
    getAllContractDevices: jest.fn().mockResolvedValue([mockContractDevice]),
    getContractDeviceById: jest.fn().mockResolvedValue(mockContractDevice),
    updateContractDevice: jest.fn().mockResolvedValue({
      ...mockContractDevice,
      device_name: 'Updated',
    }),
    deleteContractDevice: jest.fn().mockResolvedValue(undefined),
    getContractDevicesByDeviceName: jest.fn().mockResolvedValue([mockContractDevice]),
  };

  beforeEach(async () => {
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
    service = module.get<ContractDevicesService>(ContractDevicesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create contract devices', async () => {
    const dto: CreateContractDeviceDto = {
      contract_id: '123',
      device_id: 'device-123',
      device_name: 'DeviceX',
      delivery_status: 'pending',
    };
    const response = await controller.createContractDevice(2, dto);
    expect(response).toBe('Dispositivos asignados correctamente al contrato');
    expect(service.createContractDevice).toHaveBeenCalledWith(dto, 2);
  });

  it('should return all contract devices', async () => {
    const result = await controller.getAllContractDevices();
    expect(result).toEqual([mockContractDevice]);
    expect(service.getAllContractDevices).toHaveBeenCalled();
  });

  it('should return a contract device by ID', async () => {
    const result = await controller.getContractDevicesById('1');
    expect(result).toEqual(mockContractDevice);
    expect(service.getContractDeviceById).toHaveBeenCalledWith('1');
  });

  it('should update a contract device', async () => {
    const dto: CreateContractDeviceDto = {
      contract_id: '123',
      device_id: 'device-456',
      device_name: 'Updated',
      delivery_status: 'delivered',
    };
    const result = await controller.updateContractDevices('1', dto);
    expect(result.device_name).toBe('Updated');
    expect(service.updateContractDevice).toHaveBeenCalledWith('1', dto);
  });

  it('should delete a contract device', async () => {
    await controller.deleteContractDevice('1');
    expect(service.deleteContractDevice).toHaveBeenCalledWith('1');
  });

  it('should return contract devices by device name', async () => {
    const result = await controller.getContractDevicesByDeviceName('DeviceX');
    expect(result).toEqual([mockContractDevice]);
    expect(service.getContractDevicesByDeviceName).toHaveBeenCalledWith('DeviceX');
  });
});
