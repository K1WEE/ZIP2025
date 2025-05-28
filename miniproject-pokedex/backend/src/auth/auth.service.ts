import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }

    async signIn(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(email);
        if (!user) {throw new UnauthorizedException('User not found');}
        const isPasswordValid = await bcrypt.compare(pass, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }
        
        const { password, ...result } = user;
        return { message: 'Login successful', result};
    }
}
