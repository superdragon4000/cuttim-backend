import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User, { UserRole } from '../model/user.entity';
import { Equal, Repository } from 'typeorm';
import CreateUserDto from './dto/create.user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User | HttpStatus> {
    const candidate = await this.findByEmail(createUserDto.email);
    if (candidate) throw new HttpException('Email address is already in use', HttpStatus.CONFLICT);

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return await this.usersRepository.save({
      ...createUserDto,
      password: hashedPassword,
      role: UserRole.CLIENT,
    })
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOneBy({
      email: Equal(email),
    });
  }
}
