import { Test, TestingModule } from '@nestjs/testing';
import { DevicesController } from './devices.controller';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { NotFoundException } from '@nestjs/common';

describe('DevicesController', () => {
  let controller: DevicesController;
  let service: DevicesService;

  const mockDevicesService = {
    getAllDevices: jest.fn(),
    getDeviceById: jest.fn(),
    updateDevice: jest.fn(),
    deleteDevice: jest.fn(),
    createDevice: jest.fn(),
    getStock: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DevicesController],
      providers: [
        {
          provide: DevicesService,
          useValue: mockDevicesService,
        },
      ],
    }).compile();

    controller = module.get<DevicesController>(DevicesController);
    service = module.get<DevicesService>(DevicesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllDevices', () => {
    it('should return an array of devices', async () => {
      const result = [{ name: 'Device1' }];
      mockDevicesService.getAllDevices.mockResolvedValue(result);

      expect(await controller.getAllDevices()).toEqual(result);
    });
  });

  describe('getById', () => {
    it('should return a device by id', async () => {
      const result = { id: '123', name: 'Device1' };
      mockDevicesService.getDeviceById.mockResolvedValue(result);

      expect(await controller.getById('123')).toEqual(result);
    });
  });

  describe('update', () => {
    it('should update and return the device', async () => {
      const dto: CreateDeviceDto = { 
        name: 'UpdatedDevice', 
        type: 'phone', 
        status: 'active', 
        description: 'Updated description', 
        owner: 'User123', 
        image: 'image_url' 
      };
      const result = { id: '123', ...dto };
      mockDevicesService.updateDevice.mockResolvedValue(result);

      expect(await controller.update('123', dto)).toEqual(result);
    });
  });

  describe('delete', () => {
    it('should call deleteDevice with correct id', async () => {
      mockDevicesService.deleteDevice.mockResolvedValue(undefined);

      await controller.delete('123');
      expect(mockDevicesService.deleteDevice).toHaveBeenCalledWith('123');
    });
  });

  describe('create', () => {
    it('should create devices and return success message', async () => {
      const dto: CreateDeviceDto = { 
        name: 'NewDevice', 
        type: 'tablet', 
        status: 'new', 
        description: 'Default description', 
        owner: 'Default owner', 
        image: 'default_image_url' 
      };
      mockDevicesService.createDevice.mockResolvedValue('Device created successfully');

      const result = await controller.create(5, dto);
      expect(result).toBe('Device created successfully');
      expect(mockDevicesService.createDevice).toHaveBeenCalledWith(dto, 5);
    });
  });

  describe('getStock', () => {
    it('should return stock count of a device', async () => {
      mockDevicesService.getStock.mockResolvedValue(3);

      const result = await controller.getStock('DeviceName');
      expect(result).toBe(3);
    });

    it('should throw NotFoundException if no device found', async () => {
      mockDevicesService.getStock.mockRejectedValue(new NotFoundException());

      await expect(controller.getStock('UnknownDevice')).rejects.toThrow(NotFoundException);
    });
  });
});
