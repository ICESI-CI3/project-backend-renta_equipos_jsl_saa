import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserDTO } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { PaginationDTO } from '../common/dto/pagination.dto';
import { RequestDevice } from '../request_devices/entities/request_device.entity';
import { Request } from '../requests/entities/request.entity';
import { Contract } from '../contract/entities/contract.entity';
import { ContractDevice } from '../contract_devices/entities/contract_device.entity';
import { Device } from '../devices/entities/device.entity';

/**
 * Service for managing user-related operations.
 * Handles user creation, retrieval, updating, and deletion.
 * Interacts with the database through TypeORM repositories.
 */
@Injectable()
export class UsersService {


    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Request) private readonly requestRepository: Repository<Request>,
        @InjectRepository(RequestDevice) private readonly request_deviceRepository: Repository<RequestDevice>,
        @InjectRepository(Contract) private readonly contractRepository: Repository<Contract>,
        @InjectRepository(ContractDevice) private readonly contract_deviceRepository: Repository<ContractDevice>,
        @InjectRepository(Device) private readonly deviceRepository: Repository<Device>,
    ) {}

    /**
     * Creates a new user in the system.
     *
     * @param user - The data transfer object (DTO) containing the user's information.
     *               Must include properties such as `email` and `password`.
     * @returns A promise that resolves to the newly created user entity.
     * @throws An error if a user with the same email already exists.
     *
     * @remarks
     * - The user's password is hashed before being saved to the database for security purposes.
     * - This method ensures that duplicate users cannot be created based on their email address.
     */
    async createUser(user: UserDTO):Promise<User> {

        try {

            const userExists = await this.userRepository.findOne({ where: { email: user.email } });
            if (userExists) {
                throw new Error('El usuario ya existe');
            }
    
            user.password = await bcrypt.hash(user.password, 10);
    
            let newUser = await this.userRepository.create(user);

            return this.userRepository.save(newUser);
            
        } catch (error) {
            throw new InternalServerErrorException('Error al crear el usuario', error.message);
        }
       
        
    }

    /**
     * Retrieves all users from the system.
     *
     * @returns A promise that resolves to an array of user entities.
     *
     * @remarks
     * - This method fetches all users stored in the database.
     */
    getAllUsers(pagination : PaginationDTO): Promise<User[]> {
        const { limit = 10, offset = 0 } = pagination;

        return this.userRepository.find({
            take: limit,
            skip: offset
        });
    }

    /**
     * Retrieves a user by their unique identifier.
     *
     * @param id - The UUID of the user to retrieve.
     * @returns A promise that resolves to the user entity if found.
     * @throws An error if the user with the specified ID does not exist.
     *
     * @remarks
     * - This method looks up a user in the database using their unique identifier.
     */
    async getUserById(id: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('El usuario no existe');
        }
        return user;
    }

    /**
     * Retrieves a user by their email address.
     *
     * @param email - The email address of the user to retrieve.
     * @returns A promise that resolves to the user entity if found.
     * @throws An error if the user with the specified email does not exist.
     *
     * @remarks
     * - This method looks up a user in the database using their email address.
     */
    async getUserByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOne({ 
            where: { email },
            select: [ 'id','email', 'password','role' ] 
        });
        if (!user) {
            throw new NotFoundException('El usuario no existe');
        }
        return user;
    }

    async getUserRoleByEmail(email: string): Promise<string> {
        const user = await this.userRepository.findOne({ 
            where: { email },
            select: ['role'] 
        });
        if (!user) {
            throw new NotFoundException('El usuario no existe');
        }
        return user.role;
    }

    /**
     * Updates an existing user's information.
     *
     * @param id - The UUID of the user to update.
     * @param user - The data transfer object (DTO) containing the updated user's information.
     * @returns A promise that resolves to the updated user entity.
     * @throws An error if the user with the specified ID does not exist.
     *
     * @remarks
     * - This method updates the user's information in the database.
     */
    async updateUser(id: string, user: UserDTO): Promise<User> {
        const result = await this.userRepository.update(id, user);
        if (result.affected === 0) {
            throw new NotFoundException('El usuario no existe');
        }
        return this.getUserById(id);
    }

    /**
     * Deletes a user from the system.
     *
     * @param id - The UUID of the user to delete.
     * @returns A promise that resolves when the user is successfully deleted.
     * @throws An error if the user with the specified ID does not exist.
     *
     * @remarks
     * - This method removes a user from the database.
     */
    async deleteUser(id: string): Promise<void> {
        const result = await this.userRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException('El usuario no existe');
        }
    }


    /**
     * Accepts a request and creates a contract for the user.
     *
     * @param idRequest - The ID of the request to accept.
     * @returns A promise that resolves when the request is accepted and the contract is created.
     * @throws An error if the request or user does not exist.
     *
     * @remarks
     * - This method updates the status of the request to 'accepted'.
     * - It also creates a new contract for the user associated with the request.
     */
    async acceptRequest(idRequest: string): Promise<void> {
        const result = await this.requestRepository.findOne({ where: { id: idRequest } });
        if (!result) {
            throw new NotFoundException('La solicitud no existe');
        }
        this.requestRepository.update(idRequest, { status: 'accepted' });

        const user = await this.userRepository.findOne({ where: { email: result.user_email } });
        if (!user) {
            throw new NotFoundException('El usuario no existe');
        }
        

        const newContract = this.contractRepository.create({
            user_email: user.email,
            request_id: result.id,
            date_start: result.date_start,
            date_finish: result.date_finish,
            status: 'active',
            client_signature: ""
        });

        const saveContract = await this.contractRepository.save(newContract);

        const requestDevices = await this.request_deviceRepository.find({ where: { request_id: result.id } });

        if (requestDevices && requestDevices.length > 0) {
            for (const requestDevice of requestDevices) {
                await this.contract_deviceRepository.save({
                    contract_id: saveContract.id,
                    device_id: requestDevice.device_id,
                    device_name: requestDevice.device_name,
                    delivery_status: 'pending'
                });

                await this.deviceRepository.update(requestDevice.device_id, { status: 'rentado' });
            }
        }
        

    }

    /**
     * Rejects a request and deletes it from the system.
     *
     * @param idRequest - The ID of the request to reject.
     * @returns A promise that resolves when the request is rejected and deleted.
     * @throws An error if the request does not exist.
     *
     * @remarks
     * - This method updates the status of the request to 'rejected'.
     * - It also deletes any associated devices from the request.
     */
    async rejectRequest(idRequest: string): Promise<void> {
        const result = await this.requestRepository.findOne({ where: { id: idRequest } });
        if (!result) {
            throw new NotFoundException('La solicitud no existe');
        }
        this.requestRepository.update(idRequest, { status: 'rejected' });
        const requestDevices = await this.request_deviceRepository.find({ where: { request_id: result.id } });
        if (requestDevices && requestDevices.length > 0) {
            for (const requestDevice of requestDevices) {
                await this.request_deviceRepository.delete(requestDevice.id);
            }
        }

        await this.requestRepository.delete(idRequest);
    }


}
