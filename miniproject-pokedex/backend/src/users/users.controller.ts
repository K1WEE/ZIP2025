import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }
  @UseGuards(JwtAuthGuard)
  @Get('me')
  findOne(@Request() req) {
    const email = req.user.email; 
    return this.usersService.findOne(email);
  }

  @Post()
  create(@Body() User: User) {
    return this.usersService.create(User);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('')
  update(@Request() req, @Body() userinfo: User) {
    const email = req.user.email;
    return this.usersService.update(email, userinfo);
  }

  // @Delete(':email')
  // remove(@Param('email') email: string) {
  //   return this.usersService.remove(email);
  // }
}
