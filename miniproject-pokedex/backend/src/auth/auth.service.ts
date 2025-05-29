import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { access } from 'fs';
import { AuthInput } from './interface/auth.interface';
import { User } from 'src/users/entities/user.entity';
import { first, last } from 'rxjs';

type UserResult = Omit<User, 'password'> & {
    accessToken: string;
};

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private Jwtservice: JwtService,
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(username);
        if (user && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: User) {
        const payload = { name: user.first_name, email: user.email };
        return {
            access_token: this.Jwtservice.sign(payload),
        };
    }
}
