import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Query } from '@nestjs/common';
import { RequestDevicesService } from './request_devices.service';
import { CreateRequestDeviceDto } from './dto/create-request_device.dto';
import { RequestDevice } from './entities/request_device.entity';

@Controller('request-devices')
export class RequestDevicesController {
  constructor(private readonly requestDevicesService: RequestDevicesService) {}

  @Post("api/v1/")
  async createRequestDevice(
    @Body() requestDeviceDto: CreateRequestDeviceDto,
    @Query('quantity') quantity: number,
  ): Promise<RequestDevice[]> {
    return this.requestDevicesService.createRequestDevice(requestDeviceDto, quantity);
  }

  @Get("api/v1/")
  async getAllRequestDevices(): Promise<RequestDevice[]> {
    return this.requestDevicesService.getAllRequestDevices();
  }

  @Get('api/v1/:id')
  async getRequestDeviceById(@Param('id', ParseUUIDPipe) id: string): Promise<RequestDevice> {
    return this.requestDevicesService.getRequestDeviceById(id);
  }

  @Put('api/v1/:id')
  async updateRequestDevice(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() requestDeviceDto: CreateRequestDeviceDto,
  ): Promise<RequestDevice> {
    return this.requestDevicesService.updateRequestDevice(id, requestDeviceDto);
  }

  @Delete('api/v1/:id')
  async deleteRequestDevice(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.requestDevicesService.deleteRequestDevice(id);
  }

  @Get('api/v1/by-device-name/:deviceName')
  async getRequestDevicesByDeviceName(@Param('deviceName') deviceName: string): Promise<RequestDevice[]> {
    return this.requestDevicesService.getRequestDevicesByDeviceName(deviceName);
  }
}