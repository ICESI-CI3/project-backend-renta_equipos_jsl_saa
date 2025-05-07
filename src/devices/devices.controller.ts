import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';

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
    update(@Param('id', ParseUUIDPipe) id: string, @Body() device: CreateDeviceDto) {
        return this.devicesService.updateDevice(id, device);
    }

    @Delete(':id')
    delete(@Param('id', ParseUUIDPipe) id: string) {
        return this.devicesService.deleteDevice(id);
    }

    @Post()
    create(@Body() device: CreateDeviceDto, @Body('stock') stock: number) {
    return this.devicesService.createDevice(device, stock);
    }

    @Get('stock/:name')
    getStock(@Param('name') name: string) {
        return this.devicesService.getStock(name);
    }
}
