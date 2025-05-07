import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Request } from 'src/requests/entities/request.entity';
import { RequestDevice } from 'src/request_devices/entities/request_device.entity';
import { Contract } from 'src/contract/entities/contract.entity';
import { ContractDevice } from 'src/contract_devices/entities/contract_device.entity';
import { Device } from 'src/devices/entities/device.entity';

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
