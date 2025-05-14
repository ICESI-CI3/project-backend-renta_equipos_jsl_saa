import { Module } from "@nestjs/common";
import { ContractDevicesService } from "./contract_devices.service";
import { ContractDevicesController } from "./contract_devices.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContractDevice } from "./entities/contract_device.entity";
import { Contract } from "../contract/entities/contract.entity";
import { Device } from "../devices/entities/device.entity";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

@Module({
    providers: [ContractDevicesService],
    controllers: [ContractDevicesController],
    imports: [
        TypeOrmModule.forFeature([ContractDevice, Contract, Device]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
                JwtModule.registerAsync({
                  imports: [ConfigModule],
                  inject: [ConfigService],
                  useFactory: (configService: ConfigService) => ({
                    secret: configService.get('JWT_SECRET') as string || 'supersecretkey',
                    signOptions: { expiresIn: '1h' },
                  })
                   
                })
    ],
    })
export class ContractDevicesModule {}