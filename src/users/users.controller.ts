import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import User from '../model/user.entity';
import CreateUserDto from './dto/create.user.dto';
import { JwtAuthGuard } from '../auth/guards/access-token.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  createUser(@Body() createUserDto: CreateUserDto): Promise<User | HttpStatus> {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('client')
  @Get()
  getOne() {
    return 'This is a test endpoint';
  }
}
