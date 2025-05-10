import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
    Query,
  } from "@nestjs/common";
  import { ContractDevicesService } from "./contract_devices.service";
  import { CreateContractDeviceDto } from "./dto/create-contract_device.dto";
  import { ContractDevice } from "./entities/contract_device.entity";
  import { ApiTags, ApiOperation, ApiParam, ApiBody } from "@nestjs/swagger";
  
  @ApiTags('Contract Devices')
  @Controller("api/v1/contract-devices")
  export class ContractDevicesController {
    constructor(private readonly service: ContractDevicesService) {}
  
    @Post(":quantity")
    @ApiOperation({ summary: 'Crear una asignación de dispositivo a contrato' })
    @ApiParam({ name: 'quantity', type: Number, description: 'Cantidad de dispositivos a registrar' })
    @ApiBody({ type: CreateContractDeviceDto })
    createContractDevice(
    @Param('quantity') quantity: number,
    @Body() dto: CreateContractDeviceDto,): Promise<string> {
    return this.service.createContractDevice(dto, Number(quantity));
    }

  
    @Get("")
    @ApiOperation({ summary: 'Obtener todos los dispositivos de contrato' })
    async getAllContractDevices(): Promise<ContractDevice[]> {
      return this.service.getAllContractDevices();
    }
  
    @Get(":id")
    @ApiOperation({ summary: 'Obtener un dispositivo de contrato por ID' })
    @ApiParam({ name: 'id', type: 'string', description: 'UUID del dispositivo de contrato' })
    async getContractDevicesById(
      @Param("id", ParseUUIDPipe) id: string
    ): Promise<ContractDevice> {
      return this.service.getContractDeviceById(id);
    }
  
    @Put(":id")
    @ApiOperation({ summary: 'Actualizar un dispositivo de contrato' })
    @ApiParam({ name: 'id', type: 'string', description: 'UUID del dispositivo de contrato' })
    @ApiBody({ type: CreateContractDeviceDto })
    async updateContractDevices(
      @Param("id", ParseUUIDPipe) id: string,
      @Body() dto: CreateContractDeviceDto
    ): Promise<ContractDevice> {
      return this.service.updateContractDevice(id, dto);
    }
  
    @Delete(":id")
    @ApiOperation({ summary: 'Eliminar un dispositivo de contrato' })
    @ApiParam({ name: 'id', type: 'string', description: 'UUID del dispositivo de contrato' })
    async deleteContractDevice(@Param("id", ParseUUIDPipe) id: string): Promise<void> {
      return this.service.deleteContractDevice(id);
    }
  
    @Get(":deviceName")
    @ApiOperation({ summary: 'Obtener dispositivos de contrato por nombre de dispositivo' })
    @ApiParam({ name: 'deviceName', type: 'string', description: 'Nombre del dispositivo' })
    async getContractDevicesByDeviceName(
      @Param("device_name") device_name: string
    ): Promise<ContractDevice[]> {
      return this.service.getContractDevicesByDeviceName(device_name);
    }
  }
  