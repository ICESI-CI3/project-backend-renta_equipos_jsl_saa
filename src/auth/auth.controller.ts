import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/singIn.dto';
import { UsersService } from '../users/users.service';
import { Auth } from './decorators/auth.decorator';
import { ValidRoles } from './interfaces/valid-role';
import { PaginationDTO } from '../common/dto/pagination.dto';
import { UserDTO } from '../users/dto/user.dto';

@Controller('api/v1/auth')
export class AuthController {

  constructor(private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) { }

  /**
   * Signs in a user using their email and password.
   * @param signInDto - The sign-in data containing email and password.
   * @returns An object containing the access token.
   */
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  /**
   * Registers a new user.
   * @param user - The user data to register.
   * @returns The registered user information.
   */
  @Post('register')
  register(@Body() user: UserDTO) {
    return this.usersService.createUser(user);
  }

  
  /**
   * Retrieves all users.
   * @param pagination - Optional pagination parameters.
   * @returns A list of all users.
   */
  @Get('')
  @Auth(ValidRoles.admin, ValidRoles.superuser)
  getAllUsers(@Query() pagination: PaginationDTO) {
      return this.usersService.getAllUsers(pagination);
  }

  /**
   * Retrieves a user by their unique identifier.
   * @param id - The UUID of the user to retrieve.
   * @returns The user with the specified ID.
   */
  @Get(':id')
  @Auth(ValidRoles.admin, ValidRoles.superuser)
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
  @Auth(ValidRoles.admin, ValidRoles.superuser)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() user: UserDTO) {
      return this.usersService.updateUser(id, user);
  }

  /**
   * Deletes a user by their unique identifier.
   * @param id - The UUID of the user to delete.
   * @returns A confirmation of the deletion.
   */
  @Delete(':id')
  @Auth(ValidRoles.admin, ValidRoles.superuser)
  delete(@Param('id', ParseUUIDPipe) id: string) {
      return this.usersService.deleteUser(id);
  }



}
