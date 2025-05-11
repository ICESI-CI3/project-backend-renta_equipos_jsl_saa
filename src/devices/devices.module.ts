import { Module } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './entities/device.entity'; // Adjust the path as necessary
import { Auth } from '../auth/decorators/auth.decorator';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  providers: [DevicesService],
  controllers: [DevicesController],
  imports: [
    TypeOrmModule.forFeature([ Device, Auth ]), 
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') as string || 'supersecretkey',
        signOptions: { expiresIn: '1h' },
      })
    })
  ]
})
export class DevicesModule {}
