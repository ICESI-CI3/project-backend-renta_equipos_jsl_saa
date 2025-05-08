import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserDTO } from './dto/user.dto';
import { PaginationDTO } from 'src/common/dto/pagination.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from 'src/auth/guards/user-role.guard';
import { APP_GUARD } from '@nestjs/core';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUser = {
    id: '1a111111-1b11-1c11-1d11-1e1111111111',
    name: 'Juan',
    email: 'juan@example.com',
    password: 'EncryptedPassword',
    cellphone: '1234567890',
    address: 'Street 123',
  };

  const usersServiceMock = {
    getAllUsers: jest.fn().mockResolvedValue([mockUser]),
    getUserById: jest.fn().mockResolvedValue(mockUser),
    updateUser: jest.fn().mockResolvedValue(mockUser),
    deleteUser: jest.fn().mockResolvedValue(undefined),
    acceptRequest: jest.fn().mockResolvedValue({ status: 'accepted' }),
    rejectRequest: jest.fn().mockResolvedValue({ status: 'rejected' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
      ],
    })
      .overrideGuard(AuthGuard())
      .useValue({ canActivate: () => true }) // Mock auth
      .overrideGuard(UserRoleGuard)
      .useValue({ canActivate: () => true }) // Mock role
      .compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const pagination: PaginationDTO = { limit: 10, offset: 0 };
      const result = await controller.getAllUsers(pagination);
      expect(result).toEqual([mockUser]);
      expect(usersService.getAllUsers).toHaveBeenCalledWith(pagination);
    });
  });

  describe('getById', () => {
    it('should return a user by ID', async () => {
      const result = await controller.getById(mockUser.id);
      expect(result).toEqual(mockUser);
      expect(usersService.getUserById).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('update', () => {
    it('should update and return the user', async () => {
      const dto: UserDTO = {
        name: 'Updated',
        email: 'updated@example.com',
        password: '1234',
        cellphone: '987654321',
        address: 'New Street',
      };
      const result = await controller.update(mockUser.id, dto);
      expect(result).toEqual(mockUser);
      expect(usersService.updateUser).toHaveBeenCalledWith(mockUser.id, dto);
    });
  });

  describe('delete', () => {
    it('should delete a user by ID', async () => {
      const result = await controller.delete(mockUser.id);
      expect(result).toBeUndefined();
      expect(usersService.deleteUser).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('acceptsRequest', () => {
    it('should accept a user request', async () => {
      const idRequest = '2a222222-2b22-2c22-2d22-2e2222222222';
      const result = await controller.acceptsRequest(idRequest);
      expect(result).toEqual({ status: 'accepted' });
      expect(usersService.acceptRequest).toHaveBeenCalledWith(idRequest);
    });
  });

  describe('rejectRequest', () => {
    it('should reject a user request', async () => {
      const idRequest = '3a333333-3b33-3c33-3d33-3e3333333333';
      const result = await controller.rejectRequest(idRequest);
      expect(result).toEqual({ status: 'rejected' });
      expect(usersService.rejectRequest).toHaveBeenCalledWith(idRequest);
    });
  });
});
