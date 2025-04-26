import { Injectable } from "@nestjs/common";
import { RequestDevice } from "./entities/request_device.entity";
import { Device } from "../devices/entities/device.entity";
import { Request } from "../requests/entities/request.entity";
import { Repository } from "typeorm";
import { CreateRequestDeviceDto } from "./dto/create-request_device.dto";
import { NotFoundError } from "rxjs";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class RequestDevicesService {
    constructor(
        @InjectRepository(RequestDevice) private readonly requestDeviceRepository: Repository<RequestDevice>,
        @InjectRepository(Device) private readonly deviceRepository: Repository<Device>,
        @InjectRepository(Request) private readonly requestRepository: Repository<Request>
    ) {}

    async createRequestDevice(requestDevice: CreateRequestDeviceDto, quantity: number): Promise<RequestDevice[]> {
        // Verificar si hay suficientes dispositivos disponibles con el nombre especificado
        const availableDevices = await this.deviceRepository.find({ where: { name: requestDevice.deviceName, status: 'Disponible' } });
        if (availableDevices.length < quantity) {
            throw new Error(`No hay suficientes dispositivos disponibles con el nombre "${requestDevice.deviceName}". Se encontraron ${availableDevices.length}, pero se necesitan ${quantity}.`);
        }
    
        // Verificar si la solicitud (request) existe
        const requestExists = await this.requestRepository.findOne({ where: { id: requestDevice.device_id } });
        if (!requestExists) {
            throw new Error("La solicitud con el request_id especificado no existe");
        }
    
        // Crear los requestDevices en un loop
        const createdRequestDevices: RequestDevice[] = [];
        for (let i = 0; i < quantity; i++) {
            const device = availableDevices[i];
    
            // Crear el nuevo requestDevice
            const newRequestDevice = this.requestDeviceRepository.create({
                deviceName: device.name,
                request_id: requestExists.id,
            });
            const savedRequestDevice = await this.requestDeviceRepository.save(newRequestDevice);
            createdRequestDevices.push(savedRequestDevice);
    
            // Cambiar el estado del dispositivo a "Pedido"
            device.status = 'Pedido';
            await this.deviceRepository.save(device);
        }
    
        return createdRequestDevices;
    }
    async getAllRequestDevices(): Promise<RequestDevice[]> {
        return this.requestDeviceRepository.find();
    }

    async getRequestDeviceById(id: string): Promise<RequestDevice> {
        const requestDevice = await this.requestDeviceRepository.findOne({ where: { id } });
        if (!requestDevice) {
        throw new NotFoundError("La solicitud no existe");
        }
        return requestDevice;
    }

    async updateRequestDevice(id: string, requestDevice: CreateRequestDeviceDto): Promise<RequestDevice> {
        const requestDeviceExists = await this.requestDeviceRepository.findOne({ where: { id } });
        if (!requestDeviceExists) {
        throw new NotFoundError("La solicitud no existe");
        }
    
        await this.requestDeviceRepository.update(id, requestDevice);
        const updatedRequestDevice = await this.requestDeviceRepository.findOne({ where: { id } });
        if (!updatedRequestDevice) {
        throw new NotFoundError("La solicitud no existe");
        }
        return updatedRequestDevice;
    }

    async deleteRequestDevice(id: string): Promise<void> {
        const requestDeviceExists = await this.requestDeviceRepository.findOne({ where: { id } });
        if (!requestDeviceExists) {
            throw new NotFoundError('La solicitud no existe');
        }
        await this.requestDeviceRepository.delete(id);
    }
    
    async getRequestDevicesByDeviceName(deviceName: string): Promise<RequestDevice[]> {
        const requestDevices = await this.requestDeviceRepository.find({ where: { deviceName } });
        if (!requestDevices || requestDevices.length === 0) {
            throw new NotFoundError('No existen solicitudes para este dispositivo');
        }
        return requestDevices;
    }

}