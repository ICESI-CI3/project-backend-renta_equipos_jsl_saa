import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from "@nestjs/common";
import { RequestsService } from "./requests.service";
import { CreateRequestDto } from "./dto/create-request.dto";

@Controller("api/v1/requests")
export class RequestsController {
    constructor(private readonly requestsService: RequestsService) {}

    @Get("")
    getAllRequests() {
        return this.requestsService.getAllRequests();
    }

    @Get(":id")
    getById(@Param("id", ParseUUIDPipe) id: string) {
        return this.requestsService.getRequestById(id);
    }

    @Patch(":id")
    update(@Param("id", ParseUUIDPipe) id: string, @Body() request: CreateRequestDto) {
        return this.requestsService.updateRequest(id, request);
    }

    @Delete(":id")
    delete(@Param("id", ParseUUIDPipe) id: string) {
        return this.requestsService.deleteRequest(id);
    }

    @Post("")
    create(@Body() request: CreateRequestDto) {
        return this.requestsService.createRequest(request);
    }

    @Get(":user_email")
    getByUserEmail(@Param("user_email") user_email: string) {
        return this.requestsService.getRequestByUserEmail(user_email);
    }


    @Get("api/v1/status/:status")
    getByStatus(@Param("status") status: string) {
        return this.requestsService.getRequestByStatus(status);
    }
}
