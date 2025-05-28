import { Module } from "@nestjs/common";
import { RequestDevicesService } from "./request_devices.service";
import { RequestDevicesController } from "./request_devices.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RequestDevice } from "./entities/request_device.entity";
import { Device } from "../devices/entities/device.entity";
import { Request } from "../requests/entities/request.entity";

@Module({
    providers: [RequestDevicesService],
    controllers: [RequestDevicesController],
    imports: [TypeOrmModule.forFeature([RequestDevice, Device, Request])],
    })
export class RequestDevicesModule {}