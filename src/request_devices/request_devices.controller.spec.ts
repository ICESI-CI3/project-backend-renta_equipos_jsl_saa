import { Test, TestingModule } from '@nestjs/testing';
import { RequestDevicesController } from './request_devices.controller';
import { RequestDevicesService } from './request_devices.service';
import { CreateRequestDeviceDto } from './dto/create-request_device.dto';
import { RequestDevice } from './entities/request_device.entity';

describe('RequestDevicesController', () => {
  let controller: RequestDevicesController;
  let service: RequestDevicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestDevicesController],
      providers: [
        {
          provide: RequestDevicesService,
          useValue: {
            createRequestDevice: jest.fn(),
            getAllRequestDevices: jest.fn(),
            getRequestDeviceById: jest.fn(),
            updateRequestDevice: jest.fn(),
            deleteRequestDevice: jest.fn(),
            getRequestDevicesByDeviceName: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RequestDevicesController>(RequestDevicesController);
    service = module.get<RequestDevicesService>(RequestDevicesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createRequestDevice', () => {
    it('should call service.createRequestDevice and return the result', async () => {
      const requestDeviceDto: CreateRequestDeviceDto = {device_id:'device1', deviceName: 'Device1', request_id: 'request-id' };
      const quantity = 2;
      const result: RequestDevice[] = [
        { id: '1', device_id:'device1', deviceName: 'Device1', request_id: 'request-id' } as RequestDevice,
        { id: '2', device_id:'device1', deviceName: 'Device1', request_id: 'request-id' } as RequestDevice,
      ];

      jest.spyOn(service, 'createRequestDevice').mockResolvedValue(result);

      expect(await controller.createRequestDevice(requestDeviceDto, quantity)).toEqual(result);
      expect(service.createRequestDevice).toHaveBeenCalledWith(requestDeviceDto, quantity);
    });
  });

  describe('getAllRequestDevices', () => {
    it('should call service.getAllRequestDevices and return the result', async () => {
      const result: RequestDevice[] = [
        { id: '1', device_id:'device1', deviceName: 'Device1', request_id: 'request-id' } as RequestDevice,
      ];

      jest.spyOn(service, 'getAllRequestDevices').mockResolvedValue(result);

      expect(await controller.getAllRequestDevices()).toEqual(result);
      expect(service.getAllRequestDevices).toHaveBeenCalled();
    });
  });

  describe('getRequestDeviceById', () => {
    it('should call service.getRequestDeviceById and return the result', async () => {
      const id = '1';
      const result: RequestDevice = { id: '1', device_id:'device1', deviceName: 'Device1', request_id: 'request-id' } as RequestDevice;

      jest.spyOn(service, 'getRequestDeviceById').mockResolvedValue(result);

      expect(await controller.getRequestDeviceById(id)).toEqual(result);
      expect(service.getRequestDeviceById).toHaveBeenCalledWith(id);
    });
  });

  describe('updateRequestDevice', () => {
    it('should call service.updateRequestDevice and return the result', async () => {
      const id = '1';
      const requestDeviceDto: CreateRequestDeviceDto = { device_id:'device1', deviceName: 'Device1', request_id: 'request-id' };
      const result: RequestDevice = { id: '1', device_id:'device1', deviceName: 'Device1', request_id: 'request-id' } as RequestDevice;

      jest.spyOn(service, 'updateRequestDevice').mockResolvedValue(result);

      expect(await controller.updateRequestDevice(id, requestDeviceDto)).toEqual(result);
      expect(service.updateRequestDevice).toHaveBeenCalledWith(id, requestDeviceDto);
    });
  });

  describe('deleteRequestDevice', () => {
    it('should call service.deleteRequestDevice', async () => {
      const id = '1';

      jest.spyOn(service, 'deleteRequestDevice').mockResolvedValue();

      await controller.deleteRequestDevice(id);

      expect(service.deleteRequestDevice).toHaveBeenCalledWith(id);
    });
  });

  describe('getRequestDevicesByDeviceName', () => {
    it('should call service.getRequestDevicesByDeviceName and return the result', async () => {
      const deviceName = 'Device1';
      const result: RequestDevice[] = [
        { id: '1', device_id:'device1', deviceName: 'Device1', request_id: 'request-id'} as RequestDevice,
      ];

      jest.spyOn(service, 'getRequestDevicesByDeviceName').mockResolvedValue(result);

      expect(await controller.getRequestDevicesByDeviceName(deviceName)).toEqual(result);
      expect(service.getRequestDevicesByDeviceName).toHaveBeenCalledWith(deviceName);
    });
  });
});