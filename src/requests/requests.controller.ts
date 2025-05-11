import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from "@nestjs/common";
import { RequestsService } from "./requests.service";
import { CreateRequestDto } from "./dto/create-request.dto";
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBody } from "@nestjs/swagger";

@ApiTags("requests")
@Controller("api/v1/requests")
export class RequestsController {
    constructor(private readonly requestsService: RequestsService) {}

    /**
     * Retrieves all requests.
     * @returns - A promise that resolves to an array of requests.
     */
    @Get("")
    @ApiOperation({ summary: "Obtener todas las solicitudes" })
    @ApiResponse({ status: 200, description: "Lista de solicitudes" })
    getAllRequests() {
        return this.requestsService.getAllRequests();
    }

    /**
     * Retrieves a request by its ID.
     * @param id - The ID of the request to retrieve.
     * @returns - A promise that resolves to the request with the specified ID.
     */
    @Get(":id")
    @ApiOperation({ summary: "Obtener solicitud por ID" })
    @ApiParam({ name: "id", description: "UUID de la solicitud" })
    @ApiResponse({ status: 200, description: "Solicitud encontrada" })
    getById(@Param("id", ParseUUIDPipe) id: string) {
        return this.requestsService.getRequestById(id);
    }

    /**
     * Updates a request by its ID.
     * @param id - The ID of the request to update.
     * @param request - The updated request data.
     * @returns - A promise that resolves to the updated request.
     */
    @Patch(":id")
    @ApiOperation({ summary: "Actualizar solicitud por ID" })
    @ApiParam({ name: "id", description: "UUID de la solicitud" })
    @ApiBody({ type: CreateRequestDto })
    @ApiResponse({ status: 200, description: "Solicitud actualizada" })
    update(@Param("id", ParseUUIDPipe) id: string, @Body() request: CreateRequestDto) {
        return this.requestsService.updateRequest(id, request);
    }

    /**
     * Deletes a request by its ID.
     * @param id - The ID of the request to delete.
     * @returns - A promise that resolves when the request is deleted.
     */
    @Delete(":id")
    @ApiOperation({ summary: "Eliminar solicitud por ID" })
    @ApiParam({ name: "id", description: "UUID de la solicitud" })
    @ApiResponse({ status: 200, description: "Solicitud eliminada" })
    delete(@Param("id", ParseUUIDPipe) id: string) {
        return this.requestsService.deleteRequest(id);
    }

    /**
     * Creates a new request.
     * @param request - The request data to create.
     * @returns - A promise that resolves to the created request.
     */
    @Post("")
    @ApiOperation({ summary: "Crear nueva solicitud" })
    @ApiBody({ type: CreateRequestDto })
    @ApiResponse({ status: 201, description: "Solicitud creada" })
    create(@Body() request: CreateRequestDto) {
        return this.requestsService.createRequest(request);
    }

    /**
     * Retrieves requests by user email.
     * @param user_email - The email of the user whose requests to retrieve.
     * @returns - A promise that resolves to an array of requests for the specified user email.
     */
    @Get(":user_email")
    @ApiOperation({ summary: "Obtener solicitudes por correo del usuario" })
    @ApiParam({ name: "user_email", description: "Correo del usuario" })
    @ApiResponse({ status: 200, description: "Lista de solicitudes del usuario" })
    getByUserEmail(@Param("user_email") user_email: string) {
        return this.requestsService.getRequestByUserEmail(user_email);
    }

    /**
     * Retrieves requests by status.
     * @param status - The status of the requests to retrieve.
     * @returns - A promise that resolves to an array of requests with the specified status.
     */
    @Get("api/v1/status/:status")
    @ApiOperation({ summary: "Obtener solicitudes por estado" })
    @ApiParam({ name: "status", description: "Estado de la solicitud" })
    @ApiResponse({ status: 200, description: "Lista de solicitudes con ese estado" })
    getByStatus(@Param("status") status: string) {
        return this.requestsService.getRequestByStatus(status);
    }
}
