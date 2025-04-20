import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDTO } from './dto/user.dto';

/**
 * Controller for managing user-related operations.
 */
@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) {}

    /**
     * Retrieves all users.
     * @returns A list of all users.
     */
    @Get('api/v1/users')
    getAllUsers() {
        return this.usersService.getAllUsers();
    }

    /**
     * Retrieves a user by their unique identifier.
     * @param id - The UUID of the user to retrieve.
     * @returns The user with the specified ID.
     */
    @Get('api/v1/users/:id')
    getById(@Param('id', ParseUUIDPipe) id: string) {
        return this.usersService.getUserById(id);
    }

    /**
     * Updates a user's information.
     * @param id - The UUID of the user to update.
     * @param user - The updated user data.
     * @returns The updated user information.
     */
    @Patch('api/v1/users/:id')
    update(@Param('id', ParseUUIDPipe) id: string, @Body() user: UserDTO) {
        return this.usersService.updateUser(id, user);
    }

    /**
     * Deletes a user by their unique identifier.
     * @param id - The UUID of the user to delete.
     * @returns A confirmation of the deletion.
     */
    @Delete('api/v1/users/:id')
    delete(@Param('id', ParseUUIDPipe) id: string) {
        return this.usersService.deleteUser(id);
    }

    /**
     * Creates a new user.
     * @param user - The data of the user to create.
     * @returns The newly created user.
     */
    @Post('api/v1/users/')
    create(@Body() user: UserDTO) {
        return this.usersService.createUser(user);
    }

    /**
     * Logs in a user with their email and password.
     * @param user - The login credentials of the user.
     * @returns A token or session information for the logged-in user.
     */
    @Post('api/v1/users/login')
    logIn(@Body() user: UserDTO) {
        return this.usersService.logIn(user.email, user.password);
    }
}
