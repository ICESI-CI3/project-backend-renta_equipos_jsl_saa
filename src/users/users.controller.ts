import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDTO } from './dto/user.dto';
import { PaginationDTO } from 'src/common/dto/pagination.dto';

/**
 * Controller for managing user-related operations.
 */
@Controller('api/v1/users')
export class UsersController {

    constructor(private readonly usersService: UsersService) {}

    /**
     * Retrieves all users.
     * @param pagination - Optional pagination parameters.
     * @returns A list of all users.
     */
    @Get('')
    getAllUsers(@Query() pagination: PaginationDTO) {
        return this.usersService.getAllUsers(pagination);
    }

    /**
     * Retrieves a user by their unique identifier.
     * @param id - The UUID of the user to retrieve.
     * @returns The user with the specified ID.
     */
    @Get(':id')
    getById(@Param('id', ParseUUIDPipe) id: string) {
        return this.usersService.getUserById(id);
    }

    /**
     * Updates a user's information.
     * @param id - The UUID of the user to update.
     * @param user - The updated user data.
     * @returns The updated user information.
     */
    @Patch(':id')
    update(@Param('id', ParseUUIDPipe) id: string, @Body() user: UserDTO) {
        return this.usersService.updateUser(id, user);
    }

    /**
     * Deletes a user by their unique identifier.
     * @param id - The UUID of the user to delete.
     * @returns A confirmation of the deletion.
     */
    @Delete(':id')
    delete(@Param('id', ParseUUIDPipe) id: string) {
        return this.usersService.deleteUser(id);
    }

}
