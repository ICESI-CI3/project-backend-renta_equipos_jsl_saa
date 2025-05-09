import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  beforeEach(async () => {
    usersService = {
      getUserByEmail: jest.fn(),
    };

    jwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should sign in a user with correct credentials', async () => {
    const mockUser = {
      id: 'uuid-123',
      email: 'test@example.com',
      password: bcrypt.hashSync('ValidPass1', 10),
      role: 'user',
    };

    (usersService.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
    (jwtService.sign as jest.Mock).mockReturnValue('mocked-token');

    const result = await service.signIn(mockUser.email, 'ValidPass1');
    expect(result).toEqual({ access_token: 'mocked-token' });
    expect(jwtService.sign).toHaveBeenCalledWith({
      username: mockUser.email,
      sub: mockUser.id,
      role: mockUser.role,
    });
  });

  it('should throw UnauthorizedException if password is incorrect', async () => {
    const mockUser = {
      id: 'uuid-123',
      email: 'test@example.com',
      password: bcrypt.hashSync('ValidPass1', 10),
      role: 'user',
    };

    (usersService.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);

    await expect(service.signIn(mockUser.email, 'WrongPassword')).rejects.toThrow(UnauthorizedException);
  });
});
