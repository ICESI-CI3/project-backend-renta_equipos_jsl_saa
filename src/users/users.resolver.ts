import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserType } from './types/user.type';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PaginationInput } from './dto/pagination.input';

@Resolver(() => UserType)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [UserType], { name: 'users' })
  async findAll(
    @Args('pagination', { nullable: true }) pagination?: PaginationInput
  ): Promise<UserType[]> {
    const paginationDto = {
      limit: pagination?.limit || 10,
      offset: pagination?.offset || 0
    };
    return await this.usersService.getAllUsers(paginationDto);
  }

  @Query(() => UserType, { name: 'user', nullable: true })
  async findOne(@Args('id', { type: () => ID }) id: string): Promise<UserType> {
    return await this.usersService.getUserById(id);
  }

  @Query(() => UserType, { name: 'userByEmail', nullable: true })
  async findByEmail(@Args('email') email: string): Promise<UserType> {
    return await this.usersService.getUserByEmail(email);
  }

  @Mutation(() => UserType)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput
  ): Promise<UserType> {
    return await this.usersService.createUser(createUserInput);
  }

  @Mutation(() => UserType)
  async updateUser(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateUserInput') updateUserInput: UpdateUserInput
  ): Promise<UserType> {
    
    const userDto = {
      name: updateUserInput.name,
      email: updateUserInput.email,
      password: '', 
      cellphone: updateUserInput.cellphone,
      address: updateUserInput.address,
      role: updateUserInput.role
    };
    
    // Filtrar campos undefined
    const filteredDto = Object.fromEntries(
      Object.entries(userDto).filter(([_, value]) => value !== undefined && value !== '')
    );
    
    return await this.usersService.updateUser(id, filteredDto as any);
  }

  @Mutation(() => Boolean)
  async removeUser(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    await this.usersService.deleteUser(id);
    return true;
  }
}
