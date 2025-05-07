import { Module } from "@nestjs/common";
import { RequestsService } from "./requests.service";
import { RequestsController } from "./requests.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Request } from "./entities/request.entity";
import { User } from "src/users/entities/user.entity";

@Module({
    providers: [RequestsService],
    controllers: [RequestsController],
    imports: [TypeOrmModule.forFeature([Request, User])],
    })
export class RequestsModule {}