import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/interfaces/valid-role';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Devices') 
@Controller('api/v1/devices')
export class DevicesController {

    constructor(private readonly devicesService: DevicesService) {}
    /**
     * Retrieves all devices.
     * @returns - A promise that resolves to an array of devices.
     */
    @Get('')
    @ApiOperation({ summary: 'Obtiene todos los dispositivos' })
    @ApiResponse({ status: 200, description: 'Lista de dispositivos obtenida exitosamente' })
    getAllDevices() {
        return this.devicesService.getAllDevices();
    }

    /**
     * Retrieves a device by its ID.
     * @param id - The ID of the device to retrieve.
     * @returns - A promise that resolves to the device with the specified ID.
     */
    @Get('by-id/:id')
    @ApiOperation({ summary: 'Obtiene un dispositivo por su ID' })
    @ApiResponse({ status: 200, description: 'Dispositivo encontrado' })
    @ApiResponse({ status: 404, description: 'Dispositivo no encontrado' })
    getById(@Param('id', ParseUUIDPipe) id: string) {
        return this.devicesService.getDeviceById(id);
    }

    /**
     * Retrieves devices by their name.
     * @param name - The name of the device to filter by.
     * @returns - A promise that resolves to an array of devices with the specified name.
     */
    @Patch(':id')
    @Auth(ValidRoles.admin, ValidRoles.superuser)
    @ApiOperation({ summary: 'Actualiza un dispositivo' })
    @ApiResponse({ status: 200, description: 'Dispositivo actualizado correctamente' })
    @ApiResponse({ status: 404, description: 'Dispositivo no encontrado' })
    update(@Param('id', ParseUUIDPipe) id: string, @Body() device: CreateDeviceDto) {
        return this.devicesService.updateDevice(id, device);
    }

    /**
     * Deletes a device by its ID.
     * @param id - The ID of the device to delete.
     * @returns - A promise that resolves to a string indicating the result of the operation.
     */
    @Delete(':id')
    @Auth(ValidRoles.admin, ValidRoles.superuser)
    @ApiOperation({ summary: 'Elimina un dispositivo' })
    @ApiResponse({ status: 200, description: 'Dispositivo eliminado exitosamente' })
    @ApiResponse({ status: 404, description: 'Dispositivo no encontrado' })
    delete(@Param('id', ParseUUIDPipe) id: string) {
        return this.devicesService.deleteDevice(id);
    }

    /**
     * Creates a new device.
     * @param device - The device to create.
     * @returns - A promise that resolves to the created device.
     */
    @Post(':stock')
    @ApiOperation({ summary: 'Crea un nuevo dispositivo' })
    @ApiResponse({ status: 201, description: 'Dispositivo creado exitosamente' })
    create(
    @Param('stock') stock: number,
    @Body() device: CreateDeviceDto
    ) {
    return this.devicesService.createDevice(device, Number(stock));
    }


    @Get('stock/:name')
    @ApiOperation({ summary: 'Obtiene el stock de un dispositivo por su nombre' })
    @ApiResponse({ status: 200, description: 'Stock de dispositivo obtenido correctamente' })
    @ApiResponse({ status: 404, description: 'Dispositivo no encontrado' })
    getStock(@Param('name') name: string) {
        return this.devicesService.getStock(name);
    }


    @Get('by-name/:name')
    @ApiOperation({ summary: 'Obtiene un dispositivo por su nombre' })
    @ApiResponse({ status: 200, description: 'Dispositivo encontrado' })
    @ApiResponse({ status: 404, description: 'Dispositivo no encontrado' })
    getByName(@Param('name') name: string) {
        return this.devicesService.getDeviceByName(name);
    }

    @Get('by-type/:type')
    @ApiOperation({ summary: 'Obtiene dispositivos por su tipo' })
    @ApiResponse({ status: 200, description: 'Dispositivos encontrados' })
    @ApiResponse({ status: 404, description: 'No se encontraron dispositivos de este tipo' })
    getByType(@Param('type') type: string) {
        return this.devicesService.getDeviceByType(type);
    }

    @Get('by-status/:status')
    @ApiOperation({ summary: 'Obtiene dispositivos por su estado' })
    @ApiResponse({ status: 200, description: 'Dispositivos encontrados' })
    @ApiResponse({ status: 404, description: 'No se encontraron dispositivos de este estado' })
    getByStatus(@Param('status') status: string) {
        return this.devicesService.getDeviceByStatus(status);
    }



}
