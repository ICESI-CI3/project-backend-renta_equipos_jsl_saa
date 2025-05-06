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



@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +(process.env.DB_PORT || 5432 ),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true, //Only on development
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
  providers: [AppService],
})
export class AppModule {
}
