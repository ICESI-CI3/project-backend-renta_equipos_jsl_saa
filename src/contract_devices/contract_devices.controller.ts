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
  
  @Controller("api/v1/contract-devices")
  export class ContractDevicesController {
    constructor(private readonly service: ContractDevicesService) {}
  
    @Post(":quantity")
    createContractDevice(
    @Param('quantity') quantity: number,
    @Body() dto: CreateContractDeviceDto,): Promise<string> {
    return this.service.createContractDevice(dto, Number(quantity));
    }

  
    @Get("")
    async getAllContractDevices(): Promise<ContractDevice[]> {
      return this.service.getAllContractDevices();
    }
  
    @Get(":id")
    async getContractDevicesById(
      @Param("id", ParseUUIDPipe) id: string
    ): Promise<ContractDevice> {
      return this.service.getContractDeviceById(id);
    }
  
    @Put(":id")
    async updateContractDevices(
      @Param("id", ParseUUIDPipe) id: string,
      @Body() dto: CreateContractDeviceDto
    ): Promise<ContractDevice> {
      return this.service.updateContractDevice(id, dto);
    }
  
    @Delete(":id")
    async deleteContractDevice(@Param("id", ParseUUIDPipe) id: string): Promise<void> {
      return this.service.deleteContractDevice(id);
    }
  
    @Get(":device_name")
    async getContractDevicesByDeviceName(
      @Param("device_name") device_name: string
    ): Promise<ContractDevice[]> {
      return this.service.getContractDevicesByDeviceName(device_name);
    }
  }
  