import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private config: ConfigService) {}

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token, user } = await this.authService.validateLogin(body.email, body.password);
    
    // @ts-ignore
    const maxAge = ms(this.config.get<string>('REFRESH_TOKEN_EXPIRES_IN') || '1h');

    res.cookie('refresh-token', refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge, 
    });

    return { access_token, user };
  }

  @Get('profile')
  async getProfile(@Headers('Authorization') authHeader: string) {
    const token = authHeader?.split(' ')[1];
    if (!token) throw new UnauthorizedException('No token provided');

    const payload = await this.authService.verifyToken(token);
    return { user: payload };
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshToken(@CurrentUser() user: any) {
    return await this.authService.refreshToken(user);
  }
}
