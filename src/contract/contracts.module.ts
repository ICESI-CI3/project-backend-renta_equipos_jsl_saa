import { Module } from "@nestjs/common";
import { ContractsService } from "../contract/contracts.service";
import { ContractsController } from "../contract/contracts.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Contract } from "../contract/entities/contract.entity";
import { User } from "../users/entities/user.entity";
import { Request } from "../requests/entities/request.entity";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

@Module({
    providers: [ContractsService],
    controllers: [ContractsController],
    imports: [
        TypeOrmModule.forFeature([Contract, User, Request]),
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
export class ContractsModule {}