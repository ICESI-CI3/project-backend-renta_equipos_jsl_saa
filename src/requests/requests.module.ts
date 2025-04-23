import { Module } from "@nestjs/common";
import { DevicesService } from "src/devices/devices.service";
import { DevicesController } from "src/devices/devices.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Device } from "src/devices/entities/device.entity";

@Module({
    providers: [DevicesService],
    controllers: [DevicesController],
    imports: [TypeOrmModule.forFeature([Device])],
    })
export class DevicesModule {}