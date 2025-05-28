import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from "@nestjs/common";
import { RequestDevice } from "./entities/request_device.entity";
import { Device } from "../devices/entities/device.entity";
import { Request } from "../requests/entities/request.entity";
import { Repository } from "typeorm";
import { CreateRequestDeviceDto } from "./dto/create-request_device.dto";
import { InjectRepository } from "@nestjs/typeorm";

/**
 * Service for managing request-device relationships.
 * Handles association between requests and devices, including inventory management.
 */
@Injectable()
export class RequestDevicesService {
    constructor(
        @InjectRepository(RequestDevice) 
        private readonly requestDeviceRepository: Repository<RequestDevice>,
        @InjectRepository(Device) 
        private readonly deviceRepository: Repository<Device>,
        @InjectRepository(Request) 
        private readonly requestRepository: Repository<Request>
    ) {}

    /**
     * Creates multiple request-device associations and updates device status.
     * 
     * @param requestDevice - DTO containing the base request-device information
     * @param quantity - Number of devices to associate with the request
     * @returns Array of created RequestDevice entities
     * @throws BadRequestException if:
     *         - Not enough available devices
     *         - The request doesn't exist
     * @throws InternalServerErrorException for unexpected errors
     * 
     * @remarks
     * - Checks device availability before processing
     * - Updates device status to 'Pedido' (Requested) for each associated device
     * - Creates one RequestDevice record per device
     */
    async createRequestDevice(requestDevice: CreateRequestDeviceDto): Promise<String> {
        // Verifica si hay dispositivos disponibles con ese nombre
        const device = await this.deviceRepository.findOne({
            where: { name: requestDevice.device_name, status: 'Disponible' },
        });
        if (!device) {
            throw new BadRequestException("No hay dispositivos disponibles para este nombre");
        }
        // Verifica si la solicitud existe
        const requestExists = await this.requestRepository.findOne({
            where: { id: requestDevice.request_id }
        });
        if (!requestExists) {
            throw new BadRequestException("La solicitud no existe");
        }
        // Crea la asociación request-device solo para un dispositivo
        const newRequestDevice = this.requestDeviceRepository.create({
            request_id: requestDevice.request_id,
            device_id: device.id,
            device_name: device.name,
        });
        await this.requestDeviceRepository.save(newRequestDevice);
        return "Dispositivo solicitado correctamente";
    }

    /**
     * Retrieves all request-device associations.
     * 
     * @returns Array of all RequestDevice entities
     * @throws InternalServerErrorException for database errors
     */
    async getAllRequestDevices(): Promise<RequestDevice[]> {
        try {
            return await this.requestDeviceRepository.find();
        } catch (error) {
            throw new InternalServerErrorException(
                'Error al obtener las asociaciones solicitud-dispositivo',
                error.message
            );
        }
    }

    /**
     * Retrieves a specific request-device association by ID.
     * 
     * @param id - UUID of the request-device association
     * @returns The RequestDevice entity
     * @throws NotFoundException if the association doesn't exist
     */
    async getRequestDeviceById(id: string): Promise<RequestDevice> {
        try {
            const requestDevice = await this.requestDeviceRepository.findOne({ 
                where: { id } 
            });
            
            if (!requestDevice) {
                throw new NotFoundException("La asociación solicitud-dispositivo no existe");
            }
            
            return requestDevice;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(
                'Error al obtener la asociación solicitud-dispositivo',
                error.message
            );
        }
    }

    /**
     * Updates a request-device association.
     * 
     * @param id - UUID of the association to update
     * @param requestDevice - New data for the association
     * @returns The updated RequestDevice entity
     * @throws NotFoundException if the association doesn't exist
     */
    async updateRequestDevice(
        id: string, 
        requestDevice: CreateRequestDeviceDto
    ): Promise<RequestDevice> {
        try {
            const requestDeviceExists = await this.requestDeviceRepository.findOne({ 
                where: { id } 
            });
            
            if (!requestDeviceExists) {
                throw new NotFoundException("La asociación solicitud-dispositivo no existe");
            }
        
            await this.requestDeviceRepository.update(id, requestDevice);
            const updatedRequestDevice = await this.requestDeviceRepository.findOne({ 
                where: { id } 
            });
            
            if (!updatedRequestDevice) {
                throw new NotFoundException("La asociación solicitud-dispositivo no existe");
            }
            
            return updatedRequestDevice;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(
                'Error al actualizar la asociación solicitud-dispositivo',
                error.message
            );
        }
    }

    /**
     * Deletes a request-device association.
     * 
     * @param id - UUID of the association to delete
     * @throws NotFoundException if the association doesn't exist
     */
    async deleteRequestDevice(id: string): Promise<void> {
        try {
            const requestDeviceExists = await this.requestDeviceRepository.findOne({ 
                where: { id } 
            });
            
            if (!requestDeviceExists) {
                throw new NotFoundException('La asociación solicitud-dispositivo no existe');
            }
            
            await this.requestDeviceRepository.delete(id);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(
                'Error al eliminar la asociación solicitud-dispositivo',
                error.message
            );
        }
    }
    
    /**
     * Retrieves all request-device associations for a specific device.
     * 
     * @param device_name - Name of the device to filter by
     * @returns Array of matching RequestDevice entities
     * @throws NotFoundException if no associations exist for the device
     */
    async getRequestDevicesByDeviceName(device_name: string): Promise<RequestDevice[]> {
        try {
            const requestDevices = await this.requestDeviceRepository.find({ 
                where: { device_name } 
            });
            
            if (!requestDevices || requestDevices.length === 0) {
                throw new NotFoundException('No existen solicitudes para este dispositivo');
            }
            
            return requestDevices;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(
                'Error al obtener solicitudes por dispositivo',
                error.message
            );
        }
    }
}