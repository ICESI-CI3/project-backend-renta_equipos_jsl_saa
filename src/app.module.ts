import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './users/users.module';
import { DevicesModule } from './devices/devices.module';
import { RequestsModule } from './requests/requests.module';
import { RequestDevicesModule } from './request_devices/request_devices.module';
import { ContractsModule } from './contract/contracts.module';
import { ContractDevicesModule } from './contract_devices/contract_devices.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from './database/database.service';



@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL, // <-- use DATABASE_URL, not DB_HOST
      synchronize: false, //Only on development
      autoLoadEntities: true, // Automatically load entities
    }),
    UsersModule, 
    DevicesModule, 
    RequestsModule,
    RequestDevicesModule,
    ContractsModule,
    ContractDevicesModule,
    AuthModule],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
})
export class AppModule {
}
