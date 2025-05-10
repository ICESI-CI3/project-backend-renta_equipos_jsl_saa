import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Query } from '@nestjs/common';
import { RequestDevicesService } from './request_devices.service';
import { CreateRequestDeviceDto } from './dto/create-request_device.dto';
import { RequestDevice } from './entities/request_device.entity';
import {ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse,} from '@nestjs/swagger';

@ApiTags('Request Devices')
@Controller('api/v1/request-devices')
export class RequestDevicesController {
  constructor(private readonly requestDevicesService: RequestDevicesService) {}

  @Post(":quantity")
  @ApiOperation({ summary: 'Crear solicitud de dispositivo con cantidad específica' })
  @ApiParam({ name: 'quantity', type: Number, example: 3 })
  @ApiBody({ type: CreateRequestDeviceDto })
  @ApiResponse({ status: 201, description: 'Solicitud creada correctamente', type: String })
  createRequestDevice(
    @Param('quantity') quantity: number,
    @Body() requestDeviceDto: CreateRequestDeviceDto,
  ): Promise<String> {
    return this.requestDevicesService.createRequestDevice(requestDeviceDto, Number(quantity));
  }

  @Get("")
  @ApiOperation({ summary: 'Obtener todas las solicitudes de dispositivos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de todas las solicitudes de dispositivos',
    type: [RequestDevice],
  })
  async getAllRequestDevices(): Promise<RequestDevice[]> {
    return this.requestDevicesService.getAllRequestDevices();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener solicitud de dispositivo por ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Solicitud encontrada', type: RequestDevice })
  async getRequestDeviceById(@Param('id', ParseUUIDPipe) id: string): Promise<RequestDevice> {
    return this.requestDevicesService.getRequestDeviceById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar solicitud de dispositivo por ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiBody({ type: CreateRequestDeviceDto })
  @ApiResponse({ status: 200, description: 'Solicitud actualizada', type: RequestDevice })
  async updateRequestDevice(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() requestDeviceDto: CreateRequestDeviceDto,
  ): Promise<RequestDevice> {
    return this.requestDevicesService.updateRequestDevice(id, requestDeviceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar solicitud de dispositivo por ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Solicitud eliminada correctamente' })
  async deleteRequestDevice(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.requestDevicesService.deleteRequestDevice(id);
  }

  @Get(':deviceName')
  @ApiOperation({ summary: 'Buscar solicitudes por nombre del dispositivo' })
  @ApiParam({ name: 'deviceName', type: 'string', example: 'Laptop HP ProBook' })
  @ApiResponse({
    status: 200,
    description: 'Solicitudes filtradas por nombre del dispositivo',
    type: [RequestDevice],
  })
  async getRequestDevicesByDeviceName(@Param('deviceName') deviceName: string): Promise<RequestDevice[]> {
    return this.requestDevicesService.getRequestDevicesByDeviceName(deviceName);
  }
}