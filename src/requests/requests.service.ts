import { Injectable } from "@nestjs/common";
import { Request } from "./entities/request.entity";
import { Repository } from "typeorm";
import { CreateRequestDto } from "./dto/create-request.dto";
import { NotFoundError } from "rxjs";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";

@Injectable()
export class RequestsService {
    constructor(
        @InjectRepository(Request) private readonly requestRepository: Repository<Request>,
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) {}

    async createRequest(request: CreateRequestDto): Promise<Request> {
        const userEmailExists = await this.userRepository.findOne({ where: { email: request.user_email } });
        if (!userEmailExists) {
        throw new Error("El usuario no existe");
        }

        let newRequest = await this.requestRepository.create(request);
        return this.requestRepository.save(newRequest);
    }
    async getAllRequests(): Promise<Request[]> {
        return this.requestRepository.find();
    }

    async getRequestById(id: string): Promise<Request> {
        const request = await this.requestRepository.findOne({ where: { id } });
        if (!request) {
        throw new NotFoundError("La solicitud no existe");
        }
        return request;
    }

    async updateRequest(id: string, request: CreateRequestDto): Promise<Request> {
        const requestExists = await this.requestRepository.findOne({ where: { id } });
        if (!requestExists) {
        throw new NotFoundError("La solicitud no existe");
        }
    
        await this.requestRepository.update(id, request);
        const updatedRequest = await this.requestRepository.findOne({ where: { id } });
        if (!updatedRequest) {
        throw new NotFoundError("La solicitud no existe");
        }
        return updatedRequest;
    }

    async deleteRequest(id: string): Promise<void> {
        const requestExists = await this.requestRepository.findOne({ where: { id } });
        if (!requestExists) {
            throw new NotFoundError('La solicitud no existe');
        }
        await this.requestRepository.delete(id);
    }
    async getRequestByUserEmail(user_email: string): Promise<Request[]> {
        const requests = await this.requestRepository.find({ where: { user_email } });
        if (!requests || requests.length === 0) { // Verifica si el array está vacío
            throw new NotFoundError("No se encontraron solicitudes para este usuario");
        }
        return requests;
    }

    async getRequestByStatus(status: string): Promise<Request[]> {
        const requests = await this.requestRepository.find({ where: { status } });
        if (!requests || requests.length === 0) { // Verifica si el array está vacío
            throw new NotFoundError("No se encontraron solicitudes con este estado");
        }
        return requests;
    }

}
