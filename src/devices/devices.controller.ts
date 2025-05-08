import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/interfaces/valid-role';

@Controller('api/v1/devices')
export class DevicesController {

    constructor(private readonly devicesService: DevicesService) {}

    @Get('')
    getAllDevices() {
        return this.devicesService.getAllDevices();
    }

    @Get(':id')
    getById(@Param('id', ParseUUIDPipe) id: string) {
        return this.devicesService.getDeviceById(id);
    }

    @Patch(':id')
    @Auth(ValidRoles.admin, ValidRoles.superuser)
    update(@Param('id', ParseUUIDPipe) id: string, @Body() device: CreateDeviceDto) {
        return this.devicesService.updateDevice(id, device);
    }

    @Delete(':id')
    @Auth(ValidRoles.admin, ValidRoles.superuser)
    delete(@Param('id', ParseUUIDPipe) id: string) {
        return this.devicesService.deleteDevice(id);
    }

    @Post(':stock')
    create(
    @Param('stock') stock: number,
    @Body() device: CreateDeviceDto
    ) {
    return this.devicesService.createDevice(device, Number(stock));
    }


    @Get('stock/:name')
    getStock(@Param('name') name: string) {
        return this.devicesService.getStock(name);
    }
}
