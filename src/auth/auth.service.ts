import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
      private readonly usersService: UsersService,
      private readonly jwtService: JwtService,
    ) {}

    /**
     * Signs in a user using their username and password.
     * 
     * @param username - The username (email) of the user.
     * @param pass - The password of the user.
     * @throws UnauthorizedException - If the credentials are invalid.
     * @returns An object containing the access token.
     * 
     */
    async signIn(username: string, pass: string): Promise<any> {
        const user = await this.usersService.getUserByEmail(username);
        if (user?.password !== pass) {
          throw new UnauthorizedException();
        }
        const payload = { username: user.email, sub: user.id };
       
        return {
          access_token: this.jwtService.sign(payload),
        };
    }



}
