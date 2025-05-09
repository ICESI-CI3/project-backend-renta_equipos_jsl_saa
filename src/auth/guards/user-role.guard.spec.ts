import { Reflector } from '@nestjs/core';
import { UserRoleGuard } from './user-role.guard';
import { ExecutionContext, ForbiddenException, BadRequestException } from '@nestjs/common';

describe('UserRoleGuard', () => {
  let guard: UserRoleGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new UserRoleGuard(reflector);
  });

  const mockExecutionContext = (user: any, rolesMeta?: string[]) => {
    const request = {
      user,
    };

    const context: Partial<ExecutionContext> = {
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: jest.fn(),
        getNext: jest.fn(),
      }) as any,
      getHandler: jest.fn(),
    };

    // Simula reflector.get() devolviendo los roles
    jest.spyOn(reflector, 'get').mockReturnValue(rolesMeta || []);

    return context as ExecutionContext;
  };

  it('should return true if no roles are required', () => {
    const context = mockExecutionContext({ role: 'admin' }, undefined);
    const result = guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should throw BadRequestException if user is not in request', () => {
    const context = mockExecutionContext(undefined, ['admin']);
    expect(() => guard.canActivate(context)).toThrow(BadRequestException);
  });

  it('should throw BadRequestException if user has no role', () => {
    const context = mockExecutionContext({ email: 'test@test.com' }, ['admin']);
    expect(() => guard.canActivate(context)).toThrow(BadRequestException);
  });

  it('should return true if user has a valid role', () => {
    const context = mockExecutionContext({ email: 'admin@test.com', role: 'admin' }, ['admin', 'superadmin']);
    const result = guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should throw ForbiddenException if user does not have a valid role', () => {
    const context = mockExecutionContext({ email: 'user@test.com', role: 'user' }, ['admin']);
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });
});
