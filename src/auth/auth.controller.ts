import {
  Body,
  Controller,
  Get,
  Headers,
  Patch,
  Post,
  Query,
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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiCookieAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RefreshResponseDto } from './dto/refresh-response.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import User from '../model/user.entity';
import ChangePasswordDto from './dto/change-password.dto';
import { JwtAuthGuard } from './guards/access-token.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private config: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponse({
    description: 'User registered successfully',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Email already in use' })
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    const user = await this.usersService.create(registerDto);

    const { access_token, refresh_token } =
      await this.authService.issueTokens(user);

    // @ts-ignore
    const maxAge = ms(this.config.get<string>('REFRESH_TOKEN_EXPIRES_IN') || '1h',);

    res.cookie('refresh-token', refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge,
    });

    const safeUser: UserResponseDto = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      name: user.name,
    };

    return { access_token, user: safeUser };
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @ApiCreatedResponse({
    type: LoginResponseDto,
    description: 'Returns access token and user info',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    const { access_token, refresh_token, user } =
      await this.authService.validateLogin(body.email, body.password);

    // @ts-ignore
    const maxAge = ms(this.config.get<string>('REFRESH_TOKEN_EXPIRES_IN') || '1h');

    res.cookie('refresh-token', refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge,
    });

    const safeUser: UserResponseDto = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      name: user.name,
    };

    return { access_token, user: safeUser };
  }

  @Get('profile')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiOkResponse({ description: 'Current user profile', type: UserResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(
    @Headers('Authorization') authHeader: string,
  ): Promise<{ user: any } | { user: UserResponseDto }> {
    const token = authHeader?.split(' ')[1];
    if (!token) throw new UnauthorizedException('No token provided');

    const payload = await this.authService.verifyToken(token);
    return { user: payload };
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  @ApiCookieAuth('refresh-token')
  @ApiOperation({ summary: 'Refresh access token using refresh cookie' })
  @ApiOkResponse({ type: RefreshResponseDto, description: 'New access token' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refreshToken(@CurrentUser() user: any): Promise<RefreshResponseDto> {
    return await this.authService.refreshToken(user);
  }

  @Post('logout')
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'User logged out successfully' })
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refresh-token', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('client')
  @Patch('change-password')
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async changePassword(
    @Res({ passthrough: true }) res: Response,
    @CurrentUser() user: User,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.authService.changePassword(user, changePasswordDto);
    res.clearCookie('refresh-token', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return { message: 'Password changed successfully. Please log in again.' };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('client')
  @Post('send-verification-email')
  @ApiOperation({ summary: 'Send verification email to user' })
  @ApiResponse({ status: 200, description: 'Verification email sent' })
  @ApiResponse({ status: 400, description: 'Email is already verified' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 500,
    description: 'Failed to send verification email',
  })
  async sendVerificationEmail(@CurrentUser() user: User) {
    return await this.authService.sendVerificationEmail(user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('client')
  @Get('verify-email')
  @ApiOperation({ summary: 'Verify user email with token' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  async verifyEmail(@CurrentUser() user: User, @Query('token') token: string) {
    return await this.authService.verifyEmailToken(user, token);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Initiate forgot password process' })
  @ApiResponse({ description: 'Password reset email sent' })
  async forgotPassword(@Body('email') email: string) {
    return await this.authService.initiateForgotPassword(email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password using token' })
  @ApiResponse({ description: 'Password has been reset successfully' })
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.resetPassword(token, newPassword);
    res.clearCookie('refresh-token', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return { message: 'Password changed successfully. Please log in again.' };
  }
}
