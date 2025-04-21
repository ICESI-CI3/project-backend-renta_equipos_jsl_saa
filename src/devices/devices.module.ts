import { Module } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';

@Module({
  providers: [DevicesService],
  controllers: [DevicesController],
  imports: [
    TypeOrmModule.forFeature([ Device ]),
  ],
})
export class DevicesModule {}
