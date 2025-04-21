import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserDTO } from './dto/user.dto';
import bcrypt from 'bcrypt';
import { NotFoundError } from 'rxjs';
import { PaginationDTO } from 'src/common/dto/pagination.dto';

/**
 * Service for managing user-related operations.
 * Handles user creation, retrieval, updating, and deletion.
 * Interacts with the database through TypeORM repositories.
 */
@Injectable()
export class UsersService {


    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
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

    async getUserByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new NotFoundException('El usuario no existe');
        }
        return user;
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


}
