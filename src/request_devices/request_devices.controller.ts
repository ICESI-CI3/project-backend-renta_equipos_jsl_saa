import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Query } from '@nestjs/common';
import { RequestDevicesService } from './request_devices.service';
import { CreateRequestDeviceDto } from './dto/create-request_device.dto';
import { RequestDevice } from './entities/request_device.entity';

@Controller('api/v1/request-devices')
export class RequestDevicesController {
  constructor(private readonly requestDevicesService: RequestDevicesService) {}

  @Post("")
  async createRequestDevice(
    @Body() requestDeviceDto: CreateRequestDeviceDto,
    @Query('quantity') quantity: number,
  ): Promise<RequestDevice[]> {
    return this.requestDevicesService.createRequestDevice(requestDeviceDto, quantity);
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

  @Get(':deviceName')
  async getRequestDevicesByDeviceName(@Param('deviceName') deviceName: string): Promise<RequestDevice[]> {
    return this.requestDevicesService.getRequestDevicesByDeviceName(deviceName);
  }
}