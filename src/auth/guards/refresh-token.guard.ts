import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(@Inject('JWT_REFRESH_SERVICE') private refreshJwt: JwtService,) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const token = req.cookies?.['refresh-token'];

    if (!token) throw new UnauthorizedException('No refresh token');

    try {
      const payload = this.refreshJwt.verify(token);
      req['user'] = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
