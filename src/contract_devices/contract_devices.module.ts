import { Module } from "@nestjs/common";
import { ContractDevicesService } from "./contract_devices.service";
import { ContractDevicesController } from "./contract_devices.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContractDevice } from "./entities/contract_device.entity";
import { Contract } from "../contract/entities/contract.entity";
import { Device } from "../devices/entities/device.entity";

@Module({
    providers: [ContractDevicesService],
    controllers: [ContractDevicesController],
    imports: [TypeOrmModule.forFeature([ContractDevice, Contract, Device])],
    })
export class ContractDevicesModule {}