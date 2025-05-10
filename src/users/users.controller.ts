import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDTO } from './dto/user.dto';
import { PaginationDTO } from '../common/dto/pagination.dto';
import { RoleProtected } from '../auth/decorators/role-protected.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../auth/guards/user-role.guard';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/interfaces/valid-role';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';

/**
 * Controller for managing user-related operations.
 */
@ApiTags('users')
@ApiBearerAuth()
@Controller('api/v1/users')
export class UsersController {

    constructor(private readonly usersService: UsersService) {}

    /**
     * Retrieves all users.
     * @param pagination - Optional pagination parameters.
     * @returns A list of all users.
     */
    @Get('')
    @ApiOperation({ summary: 'Get all users' })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'offset', required: false, type: Number })
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
    @ApiOperation({ summary: 'Get user by ID' })
    @ApiParam({ name: 'id', type: 'string', description: 'UUID of the user' })
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
    @ApiOperation({ summary: 'Update user by ID' })
    @ApiParam({ name: 'id', type: 'string', description: 'UUID of the user' })
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
    @ApiOperation({ summary: 'Delete user by ID' })
    @ApiParam({ name: 'id', type: 'string', description: 'UUID of the user' })
    delete(@Param('id', ParseUUIDPipe) id: string) {
        return this.usersService.deleteUser(id);
    }

    @Patch('accept/:idRequest')
    @Auth(ValidRoles.admin, ValidRoles.superuser)
    @ApiOperation({ summary: 'Accept a request by ID' })
    @ApiParam({ name: 'idRequest', type: 'string', description: 'UUID of the request to accept' })
    acceptsRequest(@Param('idRequest', ParseUUIDPipe) idRequest: string) {
        return this.usersService.acceptRequest(idRequest);
    }

    @Patch('reject/:idRequest')
    @Auth(ValidRoles.admin, ValidRoles.superuser)
    @ApiOperation({ summary: 'Reject a request by ID' })
    @ApiParam({ name: 'idRequest', type: 'string', description: 'UUID of the request to reject' })
    rejectRequest(@Param('idRequest', ParseUUIDPipe) idRequest: string) {
        return this.usersService.rejectRequest(idRequest);
    }
}
