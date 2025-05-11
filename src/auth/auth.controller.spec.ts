import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/singIn.dto';
import { UserDTO } from '../users/dto/user.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: Partial<AuthService>;
  let usersService: Partial<UsersService>;

  beforeEach(async () => {
    authService = {
      signIn: jest.fn(),
    };

    usersService = {
      createUser: jest.fn(),
      getAllUsers: jest.fn(),
      getUserById: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: UsersService, useValue: usersService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should sign in a user and return a token', async () => {
    const dto: SignInDto = { email: 'user@test.com', password: 'Password1' };
    const mockToken = { access_token: 'token123' };
    (authService.signIn as jest.Mock).mockResolvedValue(mockToken);

    const result = await controller.signIn(dto);
    expect(result).toEqual(mockToken);
    expect(authService.signIn).toHaveBeenCalledWith(dto.email, dto.password);
  });

  it('should register a user', async () => {
    const dto: UserDTO = {
      name: 'John',
      email: 'john@test.com',
      password: 'ValidPass1',
      cellphone: '1234567890',
      address: 'Test Street',
    };
    const mockUser = { ...dto, id: 'uuid' };
    (usersService.createUser as jest.Mock).mockResolvedValue(mockUser);

    const result = await controller.register(dto);
    expect(result).toEqual(mockUser);
    expect(usersService.createUser).toHaveBeenCalledWith(dto);
  });

  it('should get all users', async () => {
    const pagination = { limit: 10, offset: 0 };
    const users = [{ id: '1', email: 'a@test.com' }];
    (usersService.getAllUsers as jest.Mock).mockResolvedValue(users);

    const result = await controller.getAllUsers(pagination);
    expect(result).toEqual(users);
  });

  it('should get a user by ID', async () => {
    const user = { id: 'uuid', email: 'a@test.com' };
    (usersService.getUserById as jest.Mock).mockResolvedValue(user);

    const result = await controller.getById('uuid');
    expect(result).toEqual(user);
  });

  it('should update a user', async () => {
    const dto: UserDTO = {
      name: 'Updated',
      email: 'updated@test.com',
      password: 'UpdatedPass1',
      cellphone: '1234567890',
      address: 'Updated Address',
    };
    const updatedUser = { ...dto, id: 'uuid' };
    (usersService.updateUser as jest.Mock).mockResolvedValue(updatedUser);

    const result = await controller.update('uuid', dto);
    expect(result).toEqual(updatedUser);
  });

  it('should delete a user', async () => {
    const mockDeleteResponse = { deleted: true };
    (usersService.deleteUser as jest.Mock).mockResolvedValue(mockDeleteResponse);

    const result = await controller.delete('uuid');
    expect(result).toEqual(mockDeleteResponse);
  });
});
