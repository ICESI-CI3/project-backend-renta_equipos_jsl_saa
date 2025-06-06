import { Test, TestingModule } from '@nestjs/testing';
import { RequestDevicesService } from './request_devices.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RequestDevice } from './entities/request_device.entity';
import { Device } from '../devices/entities/device.entity';
import { Request } from '../requests/entities/request.entity';
import { CreateRequestDeviceDto } from './dto/create-request_device.dto';

describe('RequestDevicesService', () => {
  let service: RequestDevicesService;
  let requestDeviceRepository: Repository<RequestDevice>;
  let deviceRepository: Repository<Device>;
  let requestRepository: Repository<Request>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestDevicesService,
        {
          provide: getRepositoryToken(RequestDevice),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Device),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Request),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<RequestDevicesService>(RequestDevicesService);
    requestDeviceRepository = module.get<Repository<RequestDevice>>(getRepositoryToken(RequestDevice));
    deviceRepository = module.get<Repository<Device>>(getRepositoryToken(Device));
    requestRepository = module.get<Repository<Request>>(getRepositoryToken(Request));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createRequestDevice', () => {
    it('should create a request device if available and request exists', async () => {
      const requestDeviceDto = { request_id: 'request-id', device_id: 'device1', device_name: 'Device1' };
      const availableDevice = { id: 'device1', name: 'Device1', status: 'Disponible', request_id: 'request-id', description: '', type: '', owner: '', image: '' };
      const request = { id: 'request-id' };

      jest.spyOn(deviceRepository, 'findOne').mockResolvedValue(availableDevice as unknown as Device);
      jest.spyOn(requestRepository, 'findOne').mockResolvedValue(request as Request);
      jest.spyOn(requestDeviceRepository, 'create').mockImplementation((dto) => dto as RequestDevice);
      jest.spyOn(requestDeviceRepository, 'save').mockImplementation(async (entity) => entity as RequestDevice);

      const result = await service.createRequestDevice(requestDeviceDto);

      expect(result).toBe('Dispositivo solicitado correctamente');
      expect(requestDeviceRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if no device is available', async () => {
      const requestDeviceDto = { request_id: 'request-id', device_id: 'device1', device_name: 'Device1' };
      jest.spyOn(deviceRepository, 'findOne').mockResolvedValue(null);
      await expect(service.createRequestDevice(requestDeviceDto)).rejects.toThrow(
        'No hay dispositivos disponibles para este nombre'
      );
    });

    it('should throw an error if the request does not exist', async () => {
      const requestDeviceDto = { request_id: 'request-id', device_id: 'device1', device_name: 'Device1' };
      jest.spyOn(deviceRepository, 'findOne').mockResolvedValue({ id: 'device1', name: 'Device1', status: 'Disponible' } as Device);
      jest.spyOn(requestRepository, 'findOne').mockResolvedValue(null);
      await expect(service.createRequestDevice(requestDeviceDto)).rejects.toThrow(
        'La solicitud no existe'
      );
    });
  });

  describe('getAllRequestDevices', () => {
    it('should return all request devices', async () => {
      const requestDevices: RequestDevice[] = [
        { id: '1', device_name: 'Device1', request_id: 'request-id' } as RequestDevice,
        { id: '2', device_name: 'Device2', request_id: 'request-id' } as RequestDevice,
      ];

      jest.spyOn(requestDeviceRepository, 'find').mockResolvedValue(requestDevices);

      const result = await service.getAllRequestDevices();

      expect(result).toEqual(requestDevices);
      expect(requestDeviceRepository.find).toHaveBeenCalled();
    });
  });

  describe('getRequestDeviceById', () => {
    it('should return a request device by ID', async () => {
      const requestDevice = { id: 'request-device-id', device_name: 'Device1' };

      jest.spyOn(requestDeviceRepository, 'findOne').mockResolvedValue(requestDevice as RequestDevice);

      const result = await service.getRequestDeviceById('request-device-id');

      expect(result).toEqual(requestDevice);
    });

    it('should throw an error if the request device does not exist', async () => {
      jest.spyOn(requestDeviceRepository, 'findOne').mockResolvedValue(null);

      await expect(service.getRequestDeviceById('non-existent-id')).rejects.toThrow('La asociación solicitud-dispositivo no existe');
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      jest.spyOn(requestDeviceRepository, 'findOne').mockRejectedValue(new Error('DB error'));
      await expect(service.getRequestDeviceById('any-id')).rejects.toThrow('Error al obtener la asociación solicitud-dispositivo');
    });
  });

  describe('updateRequestDevice', () => {
    it('should update a request device if it exists', async () => {
      const id = '1';
      const requestDeviceDto: CreateRequestDeviceDto = { device_name: 'UpdatedDevice', request_id: 'request-id' };
      const existingRequestDevice: RequestDevice = { id: '1', device_id: 'device1', device_name: 'Device1', request_id: 'request-id' } as RequestDevice;
      const updatedRequestDevice: RequestDevice = { id: '1', device_id: 'updatedDevice',device_name: 'UpdatedDevice', request_id: 'request-id' } as RequestDevice;

      jest.spyOn(requestDeviceRepository, 'findOne').mockResolvedValueOnce(existingRequestDevice);
    jest.spyOn(requestDeviceRepository, 'update').mockResolvedValue({ affected: 1 } as any);
      jest.spyOn(requestDeviceRepository, 'findOne').mockResolvedValueOnce(updatedRequestDevice);

      const result = await service.updateRequestDevice(id, requestDeviceDto);

      expect(result).toEqual(updatedRequestDevice);
      expect(requestDeviceRepository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(requestDeviceRepository.update).toHaveBeenCalledWith(id, requestDeviceDto);
    });

    it('should throw an error if the request device does not exist', async () => {
        const id = 'non-existent-id';
        const requestDeviceDto: CreateRequestDeviceDto = { device_name: 'UpdatedDevice', request_id: 'request-id' };
      
        jest.spyOn(requestDeviceRepository, 'findOne').mockResolvedValue(null);
        jest.spyOn(requestDeviceRepository, 'update').mockResolvedValue({ affected: 0 } as any); // Mock explícito para update
      
        await expect(service.updateRequestDevice(id, requestDeviceDto)).rejects.toThrow('La asociación solicitud-dispositivo no existe');
      
        expect(requestDeviceRepository.findOne).toHaveBeenCalledWith({ where: { id } });
        expect(requestDeviceRepository.update).not.toHaveBeenCalled(); // Ahora update es un mock
      });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      jest.spyOn(requestDeviceRepository, 'findOne').mockRejectedValue(new Error('DB error'));
      await expect(service.updateRequestDevice('any-id', { device_name: 'x', request_id: 'y' })).rejects.toThrow('Error al actualizar la asociación solicitud-dispositivo');
    });
  });



  describe('deleteRequestDevice', () => {
    it('should delete a request device if it exists', async () => {
      const requestDevice = { id: 'request-device-id', device_name: 'Device1' };
  
      jest.spyOn(requestDeviceRepository, 'findOne').mockResolvedValue(requestDevice as RequestDevice);
      jest.spyOn(requestDeviceRepository, 'delete').mockResolvedValue({ affected: 1 } as any);
  
      await service.deleteRequestDevice('request-device-id');
  
      expect(requestDeviceRepository.findOne).toHaveBeenCalledWith({ where: { id: 'request-device-id' } });
      expect(requestDeviceRepository.delete).toHaveBeenCalledWith('request-device-id');
    });
  
    it('should throw an error if the request device does not exist', async () => {
        jest.spyOn(requestDeviceRepository, 'findOne').mockResolvedValue(null);
        jest.spyOn(requestDeviceRepository, 'delete').mockResolvedValue({ affected: 0 } as any); // Mock explícito para delete
      
        await expect(service.deleteRequestDevice('non-existent-id')).rejects.toThrow('La asociación solicitud-dispositivo no existe');
      
        expect(requestDeviceRepository.findOne).toHaveBeenCalledWith({ where: { id: 'non-existent-id' } });
        expect(requestDeviceRepository.delete).not.toHaveBeenCalled(); // Ahora delete es un mock
      });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      jest.spyOn(requestDeviceRepository, 'findOne').mockRejectedValue(new Error('DB error'));
      await expect(service.deleteRequestDevice('any-id')).rejects.toThrow('Error al eliminar la asociación solicitud-dispositivo');
    });
  });

  describe('getRequestDevicesByDeviceName', () => {
    it('should return request devices by device name', async () => {
      const device_name = 'Device1';
      const requestDevices: RequestDevice[] = [
        { id: '1', device_name: 'Device1', request_id: 'request-id' } as RequestDevice,
      ];

      jest.spyOn(requestDeviceRepository, 'find').mockResolvedValue(requestDevices);

      const result = await service.getRequestDevicesByDeviceName(device_name);

      expect(result).toEqual(requestDevices);
      expect(requestDeviceRepository.find).toHaveBeenCalledWith({ where: { device_name } });
    });

    it('should throw an error if no request devices are found', async () => {
      const device_name = 'NonExistentDevice';

      jest.spyOn(requestDeviceRepository, 'find').mockResolvedValue([]);

      await expect(service.getRequestDevicesByDeviceName(device_name)).rejects.toThrow(
        'No existen solicitudes para este dispositivo',
      );

      expect(requestDeviceRepository.find).toHaveBeenCalledWith({ where: { device_name } });
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      jest.spyOn(requestDeviceRepository, 'find').mockRejectedValue(new Error('DB error'));
      await expect(service.getRequestDevicesByDeviceName('any-device')).rejects.toThrow('Error al obtener solicitudes por dispositivo');
    });
  });

  describe('getRequestDevicesByRequestId', () => {
    it('should return request devices by request id', async () => {
      const request_id = 'request-id';
      const requestDevices: RequestDevice[] = [
        { id: '1', device_name: 'Device1', request_id } as RequestDevice,
      ];
      jest.spyOn(requestDeviceRepository, 'find').mockResolvedValue(requestDevices);

      const result = await service.getRequestDevicesByRequestId(request_id);
      expect(result).toEqual(requestDevices);
      expect(requestDeviceRepository.find).toHaveBeenCalledWith({ where: { request_id } });
    });

    it('should throw an error if no request devices are found', async () => {
      const request_id = 'non-existent-request';
      jest.spyOn(requestDeviceRepository, 'find').mockResolvedValue([]);

      await expect(service.getRequestDevicesByRequestId(request_id)).rejects.toThrow(
        'No existen solicitudes de equipos para esta solicitud'
      );
      expect(requestDeviceRepository.find).toHaveBeenCalledWith({ where: { request_id } });
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      const request_id = 'any-request';
      jest.spyOn(requestDeviceRepository, 'find').mockRejectedValue(new Error('DB error'));
      await expect(service.getRequestDevicesByRequestId(request_id)).rejects.toThrow('Error al obtener solicitudes por ID de solicitud');
    });
  });
});