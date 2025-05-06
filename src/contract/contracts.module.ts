import { Module } from "@nestjs/common";
import { ContractsService } from "src/contract/contracts.service";
import { ContractsController } from "src/contract/contracts.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Contract } from "src/contract/entities/contract.entity";

@Module({
    providers: [ContractsService],
    controllers: [ContractsController],
    imports: [TypeOrmModule.forFeature([Contract])],
    })
export class ContractsModule {}