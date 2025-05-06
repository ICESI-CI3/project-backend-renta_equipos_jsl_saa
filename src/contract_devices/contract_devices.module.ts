import { Module } from "@nestjs/common";
import { ContractDevicesService } from "./contract_devices.service";
import { ContractDevicesController } from "./contract_devices.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContractDevice } from "./entities/contract_device.entity";

@Module({
    providers: [ContractDevicesService],
    controllers: [ContractDevicesController],
    imports: [TypeOrmModule.forFeature([ContractDevice])],
    })
export class ContractDevicesModule {}