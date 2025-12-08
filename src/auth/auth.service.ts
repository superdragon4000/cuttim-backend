import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import User from '../model/user.entity';
import ChangePasswordDto from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    @Inject('JWT_ACCESS_SERVICE') private accessJwt: JwtService,
    @Inject('JWT_REFRESH_SERVICE') private refreshJwt: JwtService,
  ) {}

  async validateLogin(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const access_token = this.accessJwt.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    const refresh_token = this.refreshJwt.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    return { access_token, refresh_token, user };
  }

  async verifyToken(token: string) {
    try {
      return this.accessJwt.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async refreshToken(user: any) {
    const newAccessToken = this.accessJwt.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    return { access_token: newAccessToken };
  }

  async issueTokens(user: User) {
    const payload = { id: user.id, email: user.email, role: user.role };
    const access_token = this.accessJwt.sign(payload);
    const refresh_token = this.refreshJwt.sign(payload);
    return { access_token, refresh_token };
  }

  async changePassword(user: User, changePasswordDto: ChangePasswordDto) {
    const existingUser = await this.usersService.findUserById(user.id);
    if (!existingUser) {
      throw new UnauthorizedException('User not found');
    }
    const isOldPasswordValid = await bcrypt.compare(
      changePasswordDto.oldPassword,
      existingUser.password,
    );
    if (!isOldPasswordValid) {
      throw new UnauthorizedException('Old password is incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    existingUser.password = hashedNewPassword;
    return await this.usersService.updateUser(existingUser, { password: hashedNewPassword });
  }
}
