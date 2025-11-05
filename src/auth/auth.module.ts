import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/access-token.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RolesGuard } from './guards/roles.guard';

@Global()
@Module({
  imports: [
    ConfigModule,
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: 'JWT_ACCESS_SERVICE',
      useFactory: (config: ConfigService) => {
        return new JwtService({
          secret: config.get('ACCESS_TOKEN_SECRET'),
          signOptions: {
            expiresIn: config.get('ACCESS_TOKEN_EXPIRES_IN'),
          },
        });
      },
      inject: [ConfigService],
    },
    {
      provide: 'JWT_REFRESH_SERVICE',
      useFactory: (config: ConfigService) => {
        return new JwtService({
          secret: config.get('REFRESH_TOKEN_SECRET'),
          signOptions: {
            expiresIn: config.get('REFRESH_TOKEN_EXPIRES_IN'),
          },
        });
      },
      inject: [ConfigService],
    },
    AuthService,
    JwtAuthGuard,
    RolesGuard,
  ],
  exports: [
    AuthService,
    JwtAuthGuard,
    'JWT_ACCESS_SERVICE',
    'JWT_REFRESH_SERVICE',
    RolesGuard,
  ],
})
export class AuthModule {}
