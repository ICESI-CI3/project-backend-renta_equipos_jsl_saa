    import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { META_ROLES } from "../decorators/role-protected.decorator";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class UserRoleGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector
    ){}

    /**
     * Extracts metadata and validates user roles for the current request.
     * @param context The execution context of the request.
     * @returns A boolean, Promise, or Observable indicating if the user has access.
     */    

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const validRoles :string [] = this.reflector.get<string[]>(META_ROLES, context.getHandler());

        if(!validRoles || validRoles.length === 0) return true;

        const request = context.switchToHttp().getRequest();
        console.log('Request', request.user);
        const user = request.user as User;

        if(!user) throw new BadRequestException('User not found in request');

        if(!user.role) throw new BadRequestException('User roles not found in request');
        
        if(validRoles.includes(user.role)) return true;

        throw new ForbiddenException(`User ${user.email} need a valid role: [${validRoles}] to access this resource`);

        
    }
}