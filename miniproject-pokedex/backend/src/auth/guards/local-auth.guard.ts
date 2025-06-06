import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    handleRequest(err: any, user: any, info: any) {
    
        if (err || !user) {
            throw new UnauthorizedException(
                info?.message || 'Invalid credentials'
            );
        }
        
        return user;
    }
}