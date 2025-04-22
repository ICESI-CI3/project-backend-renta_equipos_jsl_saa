import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
      private readonly usersService: UsersService,
      private readonly jwtSercvice: JwtService,
    ) {}

    async signIn(username: string, pass: string): Promise<any> {
        const user = await this.usersService.getUserByEmail(username);
        if (user?.password !== pass) {
          throw new UnauthorizedException();
        }
        const payload = { username: user.email, sub: user.id };
       
        return {
          access_token: this.jwtSercvice.sign(payload),
        };
    }



}
