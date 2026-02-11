import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User, { UserRole } from '../model/user.entity';
import { Equal, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../auth/dto/register.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: RegisterDto) {
    const candidate = await this.usersRepository.findOneBy({
      email: Equal(createUserDto.email),
    });
    if (candidate)
      throw new HttpException(
        'Email address is already in use',
        HttpStatus.CONFLICT,
      );

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return await this.usersRepository.save({
      ...createUserDto,
      password: hashedPassword,
      role: UserRole.CLIENT,
    });
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({
      email: Equal(email),
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findUserById(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({
      id: Equal(id),
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateUser(user: User, data): Promise<User> {
    return await this.usersRepository.save({ ...user, ...data });
  }

  async isVerified(userId: number): Promise<boolean> {
    const user = await this.findUserById(userId);
    return user.isEmailVerified;
  }

  async attachVerificationToken(userId: number, token: string) {
    const user = await this.findUserById(userId);
    user.emailVerificationToken = token;
    user.emailVerificationTokenIssuedAt = new Date();
    await this.usersRepository.save(user);
  }

  async markEmailVerified(userId: number) {
    const user = await this.findUserById(userId);
    user.isEmailVerified = true;
    await this.usersRepository.save(user);
  }

  async clearEmailToken(userId: number) {
    const user = await this.findUserById(userId);
    user.emailVerificationToken = null;
    user.emailVerificationTokenIssuedAt = null;
    await this.usersRepository.save(user);
  }

  async attachPasswordResetToken(userId: number, token: string) {
    const user = await this.findUserById(userId);
    user.passwordResetToken = token;
    user.passwordResetTokenIssuedAt = new Date();
    await this.usersRepository.save(user);
  }

  async findOneByResetToken(token: string) {
    return await this.usersRepository.findOneBy({
      passwordResetToken: token,
    });
  }
}
