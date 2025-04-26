import { Injectable, NotFoundException } from '@nestjs/common';
import { Device } from './entities/device.entity';
import { Repository } from 'typeorm';
import { CreateDeviceDto } from './dto/create-device.dto';
import { NotFoundError } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DevicesService {

    constructor(
        @InjectRepository(Device) private readonly deviceRepository: Repository<Device>,
    ) {}


    async createDevice(device: CreateDeviceDto, stock: number): Promise<Device[]> {
        const existingDevice = await this.deviceRepository.findOne({ where: { name: device.name } });
    
        if (existingDevice) {
            throw new Error('El dispositivo ya existe');
        }
    
        const createdDevices: Device[] = [];
    
        for (let i = 0; i < stock; i++) {
            const newDevice = this.deviceRepository.create({ ...device });
            const savedDevice = await this.deviceRepository.save(newDevice);
            createdDevices.push(savedDevice);
        }
    
        return createdDevices;
    }
    
    
    
    async getAllDevices(): Promise<Device[]> {
        return this.deviceRepository.find();
    }

    async getDeviceById(id: string): Promise<Device> {
        const device = await this.deviceRepository.findOne({ where: { id } });
        if (!device) {
            throw new NotFoundError('El dispositivo no existe');
        }
        return device;
    }

    async updateDevice(id: string, device: CreateDeviceDto): Promise<Device> {
        const deviceExists = await this.deviceRepository.findOne({ where: { id } });
        if (!deviceExists) {
            throw new NotFoundError('El dispositivo no existe');
        }   
            
            await this.deviceRepository.update(id, device);
            const updatedDevice = await this.deviceRepository.findOne({ where: { id } });
            if (!updatedDevice) {
                throw new NotFoundError('El dispositivo no existe');
            }
            return updatedDevice;
            
    }
    
    async deleteDevice(id: string): Promise<void> {
        const deviceExists = await this.deviceRepository.findOne({ where: { id } });
        if (!deviceExists) {
            throw new NotFoundError('El dispositivo no existe');
        }
        await this.deviceRepository.delete(id);
    }

    async getDeviceByName(name: string): Promise<Device> {
        const device = await this.deviceRepository.findOne({ where: { name } });
        if (!device) {
            throw new NotFoundError('El dispositivo no existe');
        }
        return device;
    }

    async getDeviceByType(type: string): Promise<Device[]> {
        const devices = await this.deviceRepository.find({ where: { type } });
        if (!devices || devices.length === 0) {
            throw new NotFoundError('No existen dispositivos de este tipo');
        }
        return devices;
    }
    
    async getDeviceByStatus(status: string): Promise<Device[]> {
        const devices = await this.deviceRepository.find({ where: { status } });
        if (!devices || devices.length === 0) {
            throw new NotFoundError('No existen dispositivos de este estado');
        }
        return devices;
    }

    async getStock(deviceName: string): Promise<number> {
        const count = await this.deviceRepository.count({ where: { name: deviceName } });
    
        if (count === 0) {
            throw new NotFoundException(`No devices found with name: ${deviceName}`);
        }
    
        return count;
    }
    
   

    
    
}
