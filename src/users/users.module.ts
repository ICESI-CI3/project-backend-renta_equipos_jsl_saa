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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    TypeOrmModule.forFeature([ User, Request, RequestDevice, Contract, ContractDevice, Device ]),
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
  exports : [
    UsersService
  ],
})
export class UsersModule {}
