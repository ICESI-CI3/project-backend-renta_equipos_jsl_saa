import { Test, TestingModule } from '@nestjs/testing';
import { DevicesService } from './devices.service';
import { Device } from './entities/device.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateDeviceDto } from './dto/create-device.dto';
import { NotFoundError } from 'rxjs';

describe('DevicesService', () => {
  let service: DevicesService;
  let repository: Repository<Device>;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DevicesService,
        {
          provide: getRepositoryToken(Device),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<DevicesService>(DevicesService);
    repository = module.get<Repository<Device>>(getRepositoryToken(Device));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createDevice', () => {
    it('should create and save a new device', async () => {
      const deviceDto: CreateDeviceDto = { name: 'Device1', description: 'Test', type: 'Type1', status: 'Available', stock: 10, image: 'image-url' };
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(deviceDto);
      mockRepository.save.mockResolvedValue(deviceDto);

      const result = await service.createDevice(deviceDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { name: deviceDto.name } });
      expect(mockRepository.create).toHaveBeenCalledWith(deviceDto);
      expect(mockRepository.save).toHaveBeenCalledWith(deviceDto);
      expect(result).toEqual(deviceDto);
    });

    it('should throw an error if the device already exists', async () => {
      const deviceDto: CreateDeviceDto = { name: 'Device1', description: 'Test', type: 'Type1', status: 'Available', stock: 10, image: 'image-url' };
      mockRepository.findOne.mockResolvedValue(deviceDto);

      await expect(service.createDevice(deviceDto)).rejects.toThrow('El dispositivo ya existe');
    });
  });

  describe('getAllDevices', () => {
    it('should return all devices', async () => {
      const devices = [{ id: '1', name: 'Device1' }];
      mockRepository.find.mockResolvedValue(devices);

      const result = await service.getAllDevices();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual(devices);
    });
  });

  describe('getDeviceById', () => {
    it('should return a device by id', async () => {
      const device = { id: '1', name: 'Device1' };
      mockRepository.findOne.mockResolvedValue(device);

      const result = await service.getDeviceById('1');

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual(device);
    });

    it('should throw an error if the device is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.getDeviceById('1')).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateDevice', () => {
    it('should update and return the updated device', async () => {
      const deviceDto: CreateDeviceDto = { name: 'UpdatedDevice', description: 'Updated', type: 'Type1', status: 'Available', stock: 5, image: 'image-url' };
      const updatedDevice = { id: '1', ...deviceDto };

      mockRepository.findOne.mockResolvedValue(updatedDevice);
      mockRepository.update.mockResolvedValue(undefined);
      mockRepository.findOne.mockResolvedValue(updatedDevice);

      const result = await service.updateDevice('1', deviceDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(mockRepository.update).toHaveBeenCalledWith('1', deviceDto);
      expect(result).toEqual(updatedDevice);
    });

    it('should throw an error if the device is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.updateDevice('1', {} as CreateDeviceDto)).rejects.toThrow(NotFoundError);
    });
  });

  describe('deleteDevice', () => {
    it('should delete a device', async () => {
      const device = { id: '1', name: 'Device1' };
      mockRepository.findOne.mockResolvedValue(device);
      mockRepository.delete.mockResolvedValue(undefined);

      await service.deleteDevice('1');

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(mockRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw an error if the device is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteDevice('1')).rejects.toThrow(NotFoundError);
    });
  });

  describe('getDeviceByName', () => {
    it('should return a device by name', async () => {
      const device = { id: '1', name: 'Device1' };
      mockRepository.findOne.mockResolvedValue(device);
  
      const result = await service.getDeviceByName('Device1');
  
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { name: 'Device1' } });
      expect(result).toEqual(device);
    });
  
    it('should throw an error if the device is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
  
      await expect(service.getDeviceByName('Device1')).rejects.toThrow(NotFoundError);
    });
  });
  
  describe('getDeviceByType', () => {
    it('should return devices by type', async () => {
      const devices = [{ id: '1', type: 'Type1' }];
      mockRepository.find.mockResolvedValue(devices);
  
      const result = await service.getDeviceByType('Type1');
  
      expect(mockRepository.find).toHaveBeenCalledWith({ where: { type: 'Type1' } });
      expect(result).toEqual(devices);
    });
  
    it('should throw an error if no devices are found', async () => {
      mockRepository.find.mockResolvedValue([]);
  
      await expect(service.getDeviceByType('Type1')).rejects.toThrow(NotFoundError);
    });
  });
  
  describe('getDeviceByStatus', () => {
    it('should return devices by status', async () => {
      const devices = [{ id: '1', status: 'Available' }];
      mockRepository.find.mockResolvedValue(devices);
  
      const result = await service.getDeviceByStatus('Available');
  
      expect(mockRepository.find).toHaveBeenCalledWith({ where: { status: 'Available' } });
      expect(result).toEqual(devices);
    });
  
    it('should throw an error if no devices are found', async () => {
      mockRepository.find.mockResolvedValue([]);
  
      await expect(service.getDeviceByStatus('Available')).rejects.toThrow(NotFoundError);
    });
  });
  
  describe('getDeviceByStock', () => {
    it('should return devices by stock', async () => {
      const devices = [{ id: '1', stock: 10 }];
      mockRepository.find.mockResolvedValue(devices);
  
      const result = await service.getDeviceByStock(10);
  
      expect(mockRepository.find).toHaveBeenCalledWith({ where: { stock: 10 } });
      expect(result).toEqual(devices);
    });
  
    it('should throw an error if no devices are found', async () => {
      mockRepository.find.mockResolvedValue([]);
  
      await expect(service.getDeviceByStock(10)).rejects.toThrow(NotFoundError);
    });
  });
});