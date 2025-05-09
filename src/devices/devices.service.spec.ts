import { DevicesService } from './devices.service';
import { Device } from './entities/device.entity';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundError } from 'rxjs';

const mockDeviceRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createDevice', () => {
    it('should throw if device already exists', async () => {
      repository.findOne.mockResolvedValue({ name: 'Phone' } as Device);
      await expect(service.createDevice({ name: 'Phone' } as any, 1))
        .rejects.toThrow('El dispositivo ya existe');
    });

    it('should create multiple devices', async () => {
      repository.findOne.mockResolvedValue(null);
      repository.create.mockImplementation((dto) => dto as any);
      repository.save.mockResolvedValue({} as Device);

      const result = await service.createDevice({ name: 'Tablet' } as any, 3);
      expect(result).toBe('Device created successfully');
      expect(repository.save).toHaveBeenCalledTimes(3);
    });
  });

  describe('getAllDevices', () => {
    it('should return all devices', async () => {
      const devices = [{ id: '1' }, { id: '2' }] as Device[];
      repository.find.mockResolvedValue(devices);

      const result = await service.getAllDevices();
      expect(result).toEqual(devices);
    });
  });

  describe('getDeviceById', () => {
    it('should throw if device not found', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(service.getDeviceById('123')).rejects.toThrow(NotFoundError);
    });

    it('should return the device', async () => {
      const device = { id: 'abc' } as Device;
      repository.findOne.mockResolvedValue(device);

      const result = await service.getDeviceById('abc');
      expect(result).toEqual(device);
    });
  });

  describe('updateDevice', () => {
    it('should throw if device does not exist', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(service.updateDevice('123', {} as any)).rejects.toThrow(NotFoundError);
    });

    it('should update and return the updated device', async () => {
      const updatedDevice = { id: 'xyz' } as Device;
      repository.findOne.mockResolvedValueOnce({ id: 'xyz' } as Device); // exists
      repository.findOne.mockResolvedValueOnce(updatedDevice); // updated result
      repository.update.mockResolvedValue({ affected: 1, raw: {}, generatedMaps: [] } as any);

      const result = await service.updateDevice('xyz', { name: 'New' } as any);
      expect(result).toEqual(updatedDevice);
    });
  });

  describe('deleteDevice', () => {
    it('should throw if device not found', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(service.deleteDevice('999')).rejects.toThrow(NotFoundError);
    });

    it('should call delete if device exists', async () => {
      repository.findOne.mockResolvedValue({ id: '999' } as Device);
      repository.delete.mockResolvedValue({ affected: 1, raw: {}, generatedMaps: [] } as any);

      await service.deleteDevice('999');
      expect(repository.delete).toHaveBeenCalledWith('999');
    });
  });

  describe('getDeviceByName', () => {
    it('should return device by name', async () => {
      const device = { name: 'Laptop' } as Device;
      repository.findOne.mockResolvedValue(device);

      const result = await service.getDeviceByName('Laptop');
      expect(result).toEqual(device);
    });

    it('should throw if device not found', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(service.getDeviceByName('Tablet')).rejects.toThrow(NotFoundError);
    });
  });

  describe('getDeviceByType', () => {
    it('should return devices by type', async () => {
      const devices = [{ type: 'Smartphone' }] as Device[];
      repository.find.mockResolvedValue(devices);

      const result = await service.getDeviceByType('Smartphone');
      expect(result).toEqual(devices);
    });

    it('should throw if no devices found', async () => {
      repository.find.mockResolvedValue([]);
      await expect(service.getDeviceByType('Unknown')).rejects.toThrow(NotFoundError);
    });
  });

  describe('getDeviceByStatus', () => {
    it('should return devices by status', async () => {
      const devices = [{ status: 'Disponible' }] as Device[];
      repository.find.mockResolvedValue(devices);

      const result = await service.getDeviceByStatus('Disponible');
      expect(result).toEqual(devices);
    });

    it('should throw if no devices found', async () => {
      repository.find.mockResolvedValue([]);
      await expect(service.getDeviceByStatus('Inactivo')).rejects.toThrow(NotFoundError);
    });
  });

  describe('getStock', () => {
    it('should return device stock count', async () => {
      repository.count.mockResolvedValue(5);

      const result = await service.getStock('Router');
      expect(result).toBe(5);
    });

    it('should throw if no devices found', async () => {
      repository.count.mockResolvedValue(0);
      await expect(service.getStock('NonExistent')).rejects.toThrowError(
        'No devices found with name: NonExistent'
      );
    });
  });
});
