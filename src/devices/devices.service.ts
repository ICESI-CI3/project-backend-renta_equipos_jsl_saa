import { Injectable } from '@nestjs/common';
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


    async createDevice(device: CreateDeviceDto): Promise<Device> {
        const deviceExists = await this.deviceRepository.findOne({ where: { name: device.name } });
        if (deviceExists) {
            throw new Error('El dispositivo ya existe');
        }

        let newDevice = await this.deviceRepository.create(device);
        return this.deviceRepository.save(newDevice);
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
        const deletedDevice = await this.deviceRepository.findOne({ where: { id } });
        if (deletedDevice) {
            throw new NotFoundError('El dispositivo no existe');
        }
        return;
    
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
        if (!devices) {
            throw new NotFoundError('No existen dispositivos de este tipo');
        }
        return devices;
    
    }

    async getDeviceByStatus(status: string): Promise<Device[]> {
        const devices = await this.deviceRepository.find({ where: { status } });
        if (!devices) {
            throw new NotFoundError('No existen dispositivos de este estado');
        }
        return devices;
    }

    async getDeviceByStock(stock: number): Promise<Device[]> {
        const devices = await this.deviceRepository.find({ where: { stock } });
        if (!devices) {
            throw new NotFoundError('No existen dispositivos con este stock');
        }
        return devices;

    }

    

    






    
}
