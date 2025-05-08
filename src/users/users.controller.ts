import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDTO } from './dto/user.dto';
import { PaginationDTO } from '../common/dto/pagination.dto';
import { RoleProtected } from '../auth/decorators/role-protected.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../auth/guards/user-role.guard';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/interfaces/valid-role';

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
    @UseGuards(AuthGuard())
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
    @UseGuards(AuthGuard())
    update(@Param('id', ParseUUIDPipe) id: string, @Body() user: UserDTO) {
        return this.usersService.updateUser(id, user);
    }

    /**
     * Deletes a user by their unique identifier.
     * @param id - The UUID of the user to delete.
     * @returns A confirmation of the deletion.
     */
    @Delete(':id')
    @UseGuards(AuthGuard())
    delete(@Param('id', ParseUUIDPipe) id: string) {
        return this.usersService.deleteUser(id);
    }

    @Patch('accept/:idRequest')
    @Auth(ValidRoles.admin, ValidRoles.superuser)
    acceptsRequest(@Param('idRequest', ParseUUIDPipe) idRequest: string) {
        return this.usersService.acceptRequest(idRequest);
    }

    @Patch('reject/:idRequest')
    @Auth(ValidRoles.admin, ValidRoles.superuser)
    rejectRequest(@Param('idRequest', ParseUUIDPipe) idRequest: string) {
        return this.usersService.rejectRequest(idRequest);
    }
}
