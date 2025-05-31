import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDTO } from './dto/user.dto';
import { PaginationDTO } from '../common/dto/pagination.dto';
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

    @Patch('accept/:idRequest')
    //@Auth(ValidRoles.admin, ValidRoles.superuser)
    @ApiOperation({ summary: 'Accept a request by ID' })
    @ApiParam({ name: 'idRequest', type: 'string', description: 'UUID of the request to accept' })
    acceptsRequest(@Param('idRequest', ParseUUIDPipe) idRequest: string) {
        return this.usersService.acceptRequest(idRequest);
    }

    @Patch('reject/:idRequest')
    //@Auth(ValidRoles.admin, ValidRoles.superuser)
    @ApiOperation({ summary: 'Reject a request by ID' })
    @ApiParam({ name: 'idRequest', type: 'string', description: 'UUID of the request to reject' })
    rejectRequest(@Param('idRequest', ParseUUIDPipe) idRequest: string) {
        return this.usersService.rejectRequest(idRequest);
    }
}
