import { Test, TestingModule } from '@nestjs/testing';
import { DevicesService } from './devices.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';
import { Repository } from 'typeorm';
import { NotFoundError } from 'rxjs';
import { NotFoundException } from '@nestjs/common';

const mockDeviceRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  count: jest.fn(),
});

describe('DevicesService', () => {
  let service: DevicesService;
  let repository: jest.Mocked<Repository<Device>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DevicesService,
        {
          provide: getRepositoryToken(Device),
          useFactory: mockDeviceRepository,
        },
      ],
    }).compile();

    service = module.get<DevicesService>(DevicesService);
    repository = module.get(getRepositoryToken(Device));
  });

  describe('createDevice', () => {
    it('should create multiple devices', async () => {
      repository.findOne.mockResolvedValue(null);
      repository.create.mockImplementation((dto) => dto as Device);
      repository.save.mockImplementation(async (d) => d as Device);

      const result = await service.createDevice({ name: 'Phone' } as any, 2);
      expect(result.length).toBe(2);
      expect(repository.save).toHaveBeenCalledTimes(2);
    });

    it('should throw if device already exists', async () => {
      repository.findOne.mockResolvedValue({ id: '1', name: 'Phone' } as Device);
      await expect(service.createDevice({ name: 'Phone' } as any, 2)).rejects.toThrow('El dispositivo ya existe');
    });
  });

  describe('getAllDevices', () => {
    it('should return all devices', async () => {
      repository.find.mockResolvedValue([{ id: '1' }] as Device[]);
      const result = await service.getAllDevices();
      expect(result).toHaveLength(1);
    });
  });

  describe('getDeviceById', () => {
    it('should return device by id', async () => {
      repository.findOne.mockResolvedValue({ id: '1' } as Device);
      const result = await service.getDeviceById('1');
      expect(result).toEqual({ id: '1' });
    });

    it('should throw if not found', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(service.getDeviceById('1')).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateDevice', () => {
    it('should update and return the device', async () => {
      repository.findOne.mockResolvedValueOnce({ id: '1' } as Device);
      repository.findOne.mockResolvedValueOnce({ id: '1', name: 'Updated' } as Device);

      const result = await service.updateDevice('1', { name: 'Updated' } as any);
      expect(result.name).toBe('Updated');
    });

    it('should throw if device does not exist', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(service.updateDevice('1', { name: 'X' } as any)).rejects.toThrow(NotFoundError);
    });
  });

  describe('deleteDevice', () => {
    it('should delete device', async () => {
      repository.findOne.mockResolvedValue({ id: '1' } as Device);
      await service.deleteDevice('1');
      expect(repository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw if device not found', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(service.deleteDevice('1')).rejects.toThrow(NotFoundError);
    });
  });

  describe('getDeviceByName', () => {
    it('should return device by name', async () => {
      repository.findOne.mockResolvedValue({ name: 'Tablet' } as Device);
      const result = await service.getDeviceByName('Tablet');
      expect(result.name).toBe('Tablet');
    });

    it('should throw if device not found', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(service.getDeviceByName('Tablet')).rejects.toThrow(NotFoundError);
    });
  });

  describe('getDeviceByType', () => {
    it('should return devices by type', async () => {
      repository.find.mockResolvedValue([{ type: 'Laptop' }] as Device[]);
      const result = await service.getDeviceByType('Laptop');
      expect(result.length).toBe(1);
    });

    it('should throw if no devices found', async () => {
      repository.find.mockResolvedValue([]);
      await expect(service.getDeviceByType('Laptop')).rejects.toThrow(NotFoundError);
    });
  });

  describe('getDeviceByStatus', () => {
    it('should return devices by status', async () => {
      repository.find.mockResolvedValue([{ status: 'new' }] as Device[]);
      const result = await service.getDeviceByStatus('new');
      expect(result.length).toBe(1);
    });

    it('should throw if no devices found', async () => {
      repository.find.mockResolvedValue([]);
      await expect(service.getDeviceByStatus('new')).rejects.toThrow(NotFoundError);
    });
  });

  describe('getStock', () => {
    it('should return stock count', async () => {
      repository.count.mockResolvedValue(5);
      const result = await service.getStock('Phone');
      expect(result).toBe(5);
    });

    it('should throw if no devices found', async () => {
      repository.count.mockResolvedValue(0);
      await expect(service.getStock('Phone')).rejects.toThrow(NotFoundException);
    });
  });
});
