import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import User from '../model/user.entity';
import ChangePasswordDto from './dto/change-password.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private notificationsService: NotificationsService,
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

    const hashedNewPassword = await bcrypt.hash(
      changePasswordDto.newPassword,
      10,
    );
    existingUser.password = hashedNewPassword;
    return await this.usersService.updateUser(existingUser, {
      password: hashedNewPassword,
    });
  }

  async sendVerificationEmail(user: User) {
    // todo Rate limiting, check lastVerificationEmailSentAt
    const dbUser = await this.usersService.findUserById(user.id);

    if (dbUser.isEmailVerified) throw new ConflictException('Email is already verified');
    const token = uuidv4();
    await this.usersService.attachVerificationToken(user.id, token);
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    const message = `Please verify your email by clicking the following link: ${verificationLink}`;
    const result = await this.notificationsService.send({
      to: user.email,
      subject: 'Email Verification',
      message,
      channel: 'sendGrid',
    });

    if (!('success' in result) || !result.success)
      throw new InternalServerErrorException(
        'Failed to send verification email',
      );

    return { message: 'Email verification sent' };
  }

  async verifyEmailToken(user: User, token: string): Promise<any> {
    const dbUser = await this.usersService.findUserById(user.id);

    if (
      !dbUser.emailVerificationToken ||
      dbUser.emailVerificationToken !== token
    ) {
      throw new ConflictException('Invalid token');
    }

    const issuedAt = dbUser.emailVerificationTokenIssuedAt;
    const ttlMs = 24 * 60 * 60 * 1000; // 24 часа
    
    if (!issuedAt) {
      throw new ConflictException('Token issued timestamp is missing');
    }

    const expired = Date.now() - issuedAt.getTime() > ttlMs;

    if (expired) {
      throw new ConflictException('Token expired');
    }

    await this.usersService.markEmailVerified(dbUser.id);
    await this.usersService.clearEmailToken(dbUser.id);
    return { message: 'Email verified successfully' };
  }
}
