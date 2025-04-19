import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserDTO } from './dto/user.dto';
import bcrypt from 'bcrypt';
import { NotFoundError } from 'rxjs';


@Injectable()
export class UsersService {


    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) {}

    async createUser(user: UserDTO):Promise<User> {
        const userExists = await this.userRepository.findOne({ where: { email: user.email } });
        if (userExists) {
            throw new Error('El usuario ya existe');
        }

        user.password = await bcrypt.hash(user.password, 10);

        let newUser = await this.userRepository.create(user);
        return this.userRepository.save(newUser);
    }

    getAllUsers(): Promise<User[]> {
        return this.userRepository.find();
    }

    async getUserById(id: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('El usuario no existe');
        }
        return user;
    }

    async updateUser(id: string, user: UserDTO): Promise<User> {
        const result = await this.userRepository.update(id, user);
        if (result.affected === 0) {
            throw new NotFoundException('El usuario no existe');
        }
        return this.getUserById(id);
    }

    async deleteUser(id: string): Promise<void> {
        const result = await this.userRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException('El usuario no existe');
        }
    }

    async logIn(email: string, password: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new NotFoundException('El usuario no existe');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new NotFoundException('La contraseña es incorrecta');
        }
        return user;
    }



}
