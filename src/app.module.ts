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
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';



@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: () => ({
        typePaths: ['./**/*.graphql'],
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DB_HOST,
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
  providers: [AppService, DatabaseService],
})
export class AppModule {
}
