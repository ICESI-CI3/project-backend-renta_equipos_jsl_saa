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
  
    @Post("")
    async createContractDevice(
      @Body() dto: CreateContractDeviceDto,
      @Query("quantity") quantity: number
    ): Promise<ContractDevice[]> {
      return this.service.createContractDevice(dto, quantity);
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
  
    @Get(":deviceName")
    async getContractDevicesByDeviceName(
      @Param("deviceName") deviceName: string
    ): Promise<ContractDevice[]> {
      return this.service.getContractDevicesByDeviceName(deviceName);
    }
  }
  