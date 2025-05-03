import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from "@nestjs/common";
import { RequestsService } from "./requests.service";
import { CreateRequestDto } from "./dto/create-request.dto";

@Controller("requests")
export class RequestsController {
    constructor(private readonly requestsService: RequestsService) {}

    @Get("api/v1/")
    getAllRequests() {
        return this.requestsService.getAllRequests();
    }

    @Get("api/v1/:id")
    getById(@Param("id", ParseUUIDPipe) id: string) {
        return this.requestsService.getRequestById(id);
    }

    @Patch("api/v1/:id")
    update(@Param("id", ParseUUIDPipe) id: string, @Body() request: CreateRequestDto) {
        return this.requestsService.updateRequest(id, request);
    }

    @Delete("api/v1/:id")
    delete(@Param("id", ParseUUIDPipe) id: string) {
        return this.requestsService.deleteRequest(id);
    }

    @Post("api/v1/")
    create(@Body() request: CreateRequestDto) {
        return this.requestsService.createRequest(request);
    }

    @Get("api/v1/user/:user_email")
    getByUserEmail(@Param("user_email") user_email: string) {
        return this.requestsService.getRequestByUserEmail(user_email);
    }


    @Get("api/v1/status/:status")
    getByStatus(@Param("status") status: string) {
        return this.requestsService.getRequestByStatus(status);
    }
}
