import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

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
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    const access_token = this.accessJwt.sign({ id: user.id, email: user.email, role: user.role });
    const refresh_token = this.refreshJwt.sign({ id: user.id, email: user.email, role: user.role });
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
    const newAccessToken = this.accessJwt.sign({ id: user.id, email: user.email, role: user.role });
    return { access_token: newAccessToken };
  }
}
