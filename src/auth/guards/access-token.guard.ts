import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import type { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject('JWT_ACCESS_SERVICE') private accessJwt: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<Request>();

    let token: string | undefined;

    const authHeader = req.headers['authorization'];
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) throw new UnauthorizedException('No token provided');

    try {
      const payload = this.accessJwt.verify(token);
      req['user'] = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
