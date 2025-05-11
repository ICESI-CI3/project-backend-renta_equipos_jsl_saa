import { Injectable, NotFoundException } from "@nestjs/common";
import { Contract } from "./entities/contract.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";
import { Request } from "../requests/entities/request.entity";


@Injectable()
export class ContractsService{
    constructor(
        @InjectRepository(Contract) private readonly contractRepository: Repository<Contract>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Request) private readonly requestRepository: Repository<Request>
    ){}

    async createContract(contract: Contract): Promise<Contract> {
        const userEmailExists = await this.userRepository.findOne({ where: { email: contract.user_email } });
        if (!userEmailExists) {
            throw new NotFoundException("El usuario no existe");
        }

        const requestExists = await this.requestRepository.findOne({ where: { id: contract.request_id } });
        if (!requestExists) {
            throw new NotFoundException("La solicitud no existe");
        }

        const requestAccepted = await this.requestRepository.findOne({ where: { id: contract.request_id, status: 'accepted' } });
        if (!requestAccepted) {
            throw new Error("La solicitud no ha sido aceptada");
        }


        let newContract = await this.contractRepository.create(contract);
        return this.contractRepository.save(newContract);
    }

    async getAllContracts(): Promise<Contract[]> {
        return this.contractRepository.find();
    }

    async getContractById(id: string): Promise<Contract> {
        const contract = await this.contractRepository.findOne({ where: { id } });
        if (!contract) {
            throw new Error("El contrato no existe");
        }
        return contract;
    }

    async updateContract(id: string, contract: Contract): Promise<Contract> {
        const contractExists = await this.contractRepository.findOne({ where: { id } });
        if (!contractExists) {
            throw new Error("El contrato no existe");
        }

        await this.contractRepository.update(id, contract);
        const updatedContract = await this.contractRepository.findOne({ where: { id } });
        if (!updatedContract) {
            throw new Error("El contrato no existe");
        }
        return updatedContract;
    }

    async deleteContract(id: string): Promise<void> {
        const contractExists = await this.contractRepository.findOne({ where: { id } });
        if (!contractExists) {
            throw new Error("El contrato no existe");
        }
        await this.contractRepository.delete(id);
    }

    async getContractByUserEmail(user_email: string): Promise<Contract[]> {
        const contracts = await this.contractRepository.find({ where: { user_email } });
        if (!contracts || contracts.length === 0) { // Verifica si el array está vacío
            throw new Error("No se encontraron contratos para este usuario");
        }
        return contracts;
    }


    async getContractByStatus(status: string): Promise<Contract[]> {
        const contracts = await this.contractRepository.find({ where: { status } });
        if (!contracts || contracts.length === 0) { // Verifica si el array está vacío
            throw new Error("No se encontraron contratos con este estado");
        }
        return contracts;
    }



}