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

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findOne(email);
        
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }

        const { password: _, ...result } = user;
        return result;
    }

    async login(user: User) {
        const payload = { 
            name: user.first_name, 
            email: user.email 
        };
        
        return {
            access_token: this.Jwtservice.sign(payload),
            user: {
                email: user.email,
                first_name: user.first_name,
            }
        };
    }
}
