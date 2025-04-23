import { Test, TestingModule } from '@nestjs/testing';
import { DevicesController } from './devices.controller';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';

describe('DevicesController', () => {
  let controller: DevicesController;
  let service: DevicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DevicesController],
      providers: [
        {
          provide: DevicesService,
          useValue: {
            getAllDevices: jest.fn(),
            getDeviceById: jest.fn(),
            updateDevice: jest.fn(),
            deleteDevice: jest.fn(),
            createDevice: jest.fn(),
          },
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
    it('should call DevicesService.getAllDevices', () => {
      controller.getAllDevices();
      expect(service.getAllDevices).toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('should call DevicesService.getDeviceById with correct id', () => {
      const id = 'some-uuid';
      controller.getById(id);
      expect(service.getDeviceById).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should call DevicesService.updateDevice with correct id and device', () => {
      const id = 'some-uuid';
      const device: CreateDeviceDto = { 
        name: 'Device Name', 
        description: 'Device Description', 
        type: 'Device Type', 
        status: 'Available', 
        stock: 10, 
        image: 'image-url' 
      };
      controller.update(id, device);
      expect(service.updateDevice).toHaveBeenCalledWith(id, device);
    });
  });

  describe('delete', () => {
    it('should call DevicesService.deleteDevice with correct id', () => {
      const id = 'some-uuid';
      controller.delete(id);
      expect(service.deleteDevice).toHaveBeenCalledWith(id);
    });
  });

  describe('create', () => {
    it('should call DevicesService.createDevice with correct device', () => {
      const device: CreateDeviceDto = { 
        name: 'Device Name', 
        description: 'Device Description', 
        type: 'Device Type', 
        status: 'Available', 
        stock: 10, 
        image: 'image-url' 
      };
      controller.create(device);
      expect(service.createDevice).toHaveBeenCalledWith(device);
    });
  });
});