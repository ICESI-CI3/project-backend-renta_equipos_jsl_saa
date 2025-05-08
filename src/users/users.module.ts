import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Request } from '../requests/entities/request.entity';
import { RequestDevice } from '../request_devices/entities/request_device.entity';
import { Contract } from '../contract/entities/contract.entity';
import { ContractDevice } from '../contract_devices/entities/contract_device.entity';
import { Device } from '../devices/entities/device.entity';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    TypeOrmModule.forFeature([ User, Request, RequestDevice, Contract, ContractDevice, Device ]),
  ],
  exports : [
    UsersService
  ],
})
export class UsersModule {}
