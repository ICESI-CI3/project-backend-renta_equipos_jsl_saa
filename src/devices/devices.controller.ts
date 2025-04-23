import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';

@Controller('devices')
export class DevicesController {

    constructor(private readonly devicesService: DevicesService) {}

    @Get('api/v1/')
    getAllDevices() {
        return this.devicesService.getAllDevices();
    }

    @Get('api/v1/:id')
    getById(@Param('id', ParseUUIDPipe) id: string) {
        return this.devicesService.getDeviceById(id);
    }

    @Patch('api/v1/:id')
    update(@Param('id', ParseUUIDPipe) id: string, @Body() device: CreateDeviceDto) {
        return this.devicesService.updateDevice(id, device);
    }

    @Delete('api/v1/:id')
    delete(@Param('id', ParseUUIDPipe) id: string) {
        return this.devicesService.deleteDevice(id);
    }

    @Post('api/v1/')
    create(@Body() device: CreateDeviceDto) {
        return this.devicesService.createDevice(device);
    }
}