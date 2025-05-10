import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Query } from '@nestjs/common';
import { RequestDevicesService } from './request_devices.service';
import { CreateRequestDeviceDto } from './dto/create-request_device.dto';
import { RequestDevice } from './entities/request_device.entity';

@Controller('api/v1/request-devices')
export class RequestDevicesController {
  constructor(private readonly requestDevicesService: RequestDevicesService) {}

  @Post(":quantity")
  createRequestDevice(
    @Param('quantity') quantity: number,
    @Body() requestDeviceDto: CreateRequestDeviceDto,
  ): Promise<String> {
    return this.requestDevicesService.createRequestDevice(requestDeviceDto, Number(quantity));
  }

  @Get("")
  async getAllRequestDevices(): Promise<RequestDevice[]> {
    return this.requestDevicesService.getAllRequestDevices();
  }

  @Get(':id')
  async getRequestDeviceById(@Param('id', ParseUUIDPipe) id: string): Promise<RequestDevice> {
    return this.requestDevicesService.getRequestDeviceById(id);
  }

  @Put(':id')
  async updateRequestDevice(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() requestDeviceDto: CreateRequestDeviceDto,
  ): Promise<RequestDevice> {
    return this.requestDevicesService.updateRequestDevice(id, requestDeviceDto);
  }

  @Delete(':id')
  async deleteRequestDevice(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.requestDevicesService.deleteRequestDevice(id);
  }

  @Get(':device_name')
  async getRequestDevicesByDeviceName(@Param('device_name') device_name: string): Promise<RequestDevice[]> {
    return this.requestDevicesService.getRequestDevicesByDeviceName(device_name);
  }
}