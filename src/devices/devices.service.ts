import { Injectable, NotFoundException } from '@nestjs/common';
import { Device } from './entities/device.entity';
import { Repository } from 'typeorm';
import { CreateDeviceDto } from './dto/create-device.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DevicesService {

    constructor(
        @InjectRepository(Device) private readonly deviceRepository: Repository<Device>,
    ) {}

    /**
     * Creates a new device and saves it to the database.
     * @param device - The device data transfer object.
     * @param stock - The number of devices to create.
     * @returns A message indicating the result of the operation.
     */
    async createDevice(device: CreateDeviceDto, stock: number): Promise<string> {
        const existingDevice = await this.deviceRepository.findOne({
          where: { name: device.name },
        });
      
        if (existingDevice) {
          throw new Error('El dispositivo ya existe');
        }
      
        for (let i = 0; i < stock; i++) {
          const newDevice = this.deviceRepository.create(device);
          await this.deviceRepository.save(newDevice);
        }
      
        return 'Device created successfully';
      }
      
    
    
    /**
     * Retrieves all devices from the database.
     * @returns - An array of devices.
     */
    async getAllDevices(): Promise<Device[]> {
        return this.deviceRepository.find();
    }

    /**
     * Retrieves a device by its ID.
     * @param id - The ID of the device to retrieve.
     * @returns - The device with the specified ID.
     */
    async getDeviceById(id: string): Promise<Device> {
        const device = await this.deviceRepository.findOne({ where: { id } });
        if (!device) {
            throw new NotFoundException('El dispositivo no existe');
        }
        return device;
    }

    /**
     * Retrieves devices by their name.
     * @param name - The name of the device to filter by.
     * @returns - An array of devices with the specified name.
     */
    async updateDevice(id: string, device: CreateDeviceDto): Promise<Device> {
        const deviceExists = await this.deviceRepository.findOne({ where: { id } });
        if (!deviceExists) {
            throw new NotFoundException('El dispositivo no existe');
        }   
            
            await this.deviceRepository.update(id, device);
            const updatedDevice = await this.deviceRepository.findOne({ where: { id } });
            if (!updatedDevice) {
                throw new NotFoundException('El dispositivo no existe');
            }
            return updatedDevice;
            
    }
    
    /**
     * Deletes a device by its ID.
     * @param id - The ID of the device to delete.
     * @returns - A message indicating the result of the operation.
     */
    async deleteDevice(id: string): Promise<void> {
        const deviceExists = await this.deviceRepository.findOne({ where: { id } });
        if (!deviceExists) {
            throw new NotFoundException('El dispositivo no existe');
        }
        await this.deviceRepository.delete(id);
    }

    /**
     * Retrieves devices by their name.
     * @param name - The name of the device to filter by.
     * @returns - An array of devices with the specified name.
     */
    async getDeviceByName(name: string): Promise<Device> {
        const device = await this.deviceRepository.findOne({ where: { name } });
        if (!device) {
            throw new NotFoundException('El dispositivo no existe');
        }
        return device;
    }

    /**
     * Retrieves devices by their type.
     * @param type - The type of the device to filter by.
     * @returns - An array of devices with the specified type.
     */
    async getDeviceByType(type: string): Promise<Device[]> {
        const devices = await this.deviceRepository.find({ where: { type } });
        if (!devices || devices.length === 0) {
            throw new NotFoundException('No existen dispositivos de este tipo');
        }
        return devices;
    }
    
    /**
     * Retrieves devices by their status.
     * @param status - The status of the device to filter by.
     * @returns - An array of devices with the specified status.
     */
    async getDeviceByStatus(status: string): Promise<Device[]> {
        const devices = await this.deviceRepository.find({ where: { status } });
        if (!devices || devices.length === 0) {
            throw new NotFoundException('No existen dispositivos de este estado');
        }
        return devices;
    }

    /**
     * Retrieves devices by their brand.
     * @param brand - The brand of the device to filter by.
     * @returns - An array of devices with the specified brand.
     */
    async getStock(device_name: string): Promise<number> {
        const count = await this.deviceRepository.count({ where: { name: device_name } });
    
        if (count === 0) {
            throw new NotFoundException(`No devices found with name: ${device_name}`);
        }
    
        return count;
    }
    
   

    
    
}
