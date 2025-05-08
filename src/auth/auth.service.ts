import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

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
        console.log('User', user);
        let isMatch = bcrypt.compareSync(pass, user.password);

        if (isMatch === false) {
          throw new UnauthorizedException('Invalid credentials');
        }
        const payload = { username: user.email, sub: user.id, role: user.role };
       
        return {
          access_token: this.jwtService.sign(payload),
        };
    }



}
