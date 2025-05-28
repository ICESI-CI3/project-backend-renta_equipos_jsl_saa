import { Injectable, NotFoundException } from "@nestjs/common";
import { Request } from "./entities/request.entity";
import { Repository } from "typeorm";
import { CreateRequestDto } from "./dto/create-request.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";

@Injectable()
export class RequestsService {
    constructor(
        @InjectRepository(Request) private readonly requestRepository: Repository<Request>,
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) {}

    /**
     * Creates a new request.
     * @param request - The request data to create.
     * @returns - A promise that resolves to the created request.
     */
    async createRequest(request: CreateRequestDto): Promise<Request> {
        const userEmailExists = await this.userRepository.findOne({ where: { email: request.user_email } });
        if (!userEmailExists) {
        throw new Error("El usuario no existe");
        }

        // Map DTO fields to entity fields (handle case differences)
        const newRequest = this.requestRepository.create({
            user_email: request.user_email,
            date_start: request.date_Start, // map camelCase to snake_case
            date_finish: request.date_Finish,
            status: request.status,
            admin_comment: request.admin_comment ?? '',
        });
        return this.requestRepository.save(newRequest);
    }

    /**
     * Retrieves all requests.
     * @returns - A promise that resolves to an array of requests.
     */
    async getAllRequests(): Promise<Request[]> {
        return this.requestRepository.find();
    }

    /**
     * Retrieves a request by its ID.
     * @param id - The ID of the request to retrieve.
     * @returns - A promise that resolves to the request with the specified ID.
     */
    async getRequestById(id: string): Promise<Request> {
        const request = await this.requestRepository.findOne({ where: { id } });
        if (!request) {
        throw new NotFoundException("La solicitud no existe");
        }
        return request;
    }

    /**
     * Updates a request by its ID.
     * @param id - The ID of the request to update.
     * @param request - The updated request data.
     * @returns - A promise that resolves to the updated request.
     */
    async updateRequest(id: string, request: CreateRequestDto): Promise<Request> {
        const requestExists = await this.requestRepository.findOne({ where: { id } });
        if (!requestExists) {
        throw new NotFoundException("La solicitud no existe");
        }
    
        await this.requestRepository.update(id, request);
        const updatedRequest = await this.requestRepository.findOne({ where: { id } });
        if (!updatedRequest) {
        throw new NotFoundException("La solicitud no existe");
        }
        return updatedRequest;
    }

    /**
     * Deletes a request by its ID.
     * @param id - The ID of the request to delete.
     * @returns - A promise that resolves when the request is deleted.
     */
    async deleteRequest(id: string): Promise<void> {
        const requestExists = await this.requestRepository.findOne({ where: { id } });
        if (!requestExists) {
            throw new NotFoundException('La solicitud no existe');
        }
        await this.requestRepository.delete(id);
    }

    /**
     * Retrieves requests by user email.
     * @param user_email - The email of the user whose requests to retrieve.
     * @returns - A promise that resolves to an array of requests for the specified user email.
     */
    async getRequestByUserEmail(user_email: string): Promise<Request[]> {
        const requests = await this.requestRepository.find({ where: { user_email } });
        if (!requests || requests.length === 0) { // Verifica si el array está vacío
            throw new NotFoundException("No se encontraron solicitudes para este usuario");
        }
        return requests;
    }

    /**
     * Retrieves requests by status.
     * @param status - The status of the requests to retrieve.
     * @returns - A promise that resolves to an array of requests with the specified status.
     */
    async getRequestByStatus(status: string): Promise<Request[]> {
        const requests = await this.requestRepository.find({ where: { status } });
        if (!requests || requests.length === 0) { // Verifica si el array está vacío
            throw new NotFoundException("No se encontraron solicitudes con este estado");
        }
        return requests;
    }

}
