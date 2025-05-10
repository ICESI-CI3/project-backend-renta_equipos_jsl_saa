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

    @Get('')
    @ApiOperation({ summary: 'Obtiene todos los dispositivos' })
    @ApiResponse({ status: 200, description: 'Lista de dispositivos obtenida exitosamente' })
    getAllDevices() {
        return this.devicesService.getAllDevices();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtiene un dispositivo por su ID' })
    @ApiResponse({ status: 200, description: 'Dispositivo encontrado' })
    @ApiResponse({ status: 404, description: 'Dispositivo no encontrado' })
    getById(@Param('id', ParseUUIDPipe) id: string) {
        return this.devicesService.getDeviceById(id);
    }

    @Patch(':id')
    @Auth(ValidRoles.admin, ValidRoles.superuser)
    @ApiOperation({ summary: 'Actualiza un dispositivo' })
    @ApiResponse({ status: 200, description: 'Dispositivo actualizado correctamente' })
    @ApiResponse({ status: 404, description: 'Dispositivo no encontrado' })
    update(@Param('id', ParseUUIDPipe) id: string, @Body() device: CreateDeviceDto) {
        return this.devicesService.updateDevice(id, device);
    }

    @Delete(':id')
    @Auth(ValidRoles.admin, ValidRoles.superuser)
    @ApiOperation({ summary: 'Elimina un dispositivo' })
    @ApiResponse({ status: 200, description: 'Dispositivo eliminado exitosamente' })
    @ApiResponse({ status: 404, description: 'Dispositivo no encontrado' })
    delete(@Param('id', ParseUUIDPipe) id: string) {
        return this.devicesService.deleteDevice(id);
    }

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
}
