import { Module } from "@nestjs/common";
import { ContractsService } from "../contract/contracts.service";
import { ContractsController } from "../contract/contracts.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Contract } from "../contract/entities/contract.entity";
import { User } from "../users/entities/user.entity";
import { Request } from "../requests/entities/request.entity";

@Module({
    providers: [ContractsService],
    controllers: [ContractsController],
    imports: [TypeOrmModule.forFeature([Contract, User, Request])],
    })
export class ContractsModule {}