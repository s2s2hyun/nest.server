import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get<boolean>(
      'public',
      context.getHandler(),
    );
    if (isPublic) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    try {
      const token =
        req.cookies['access_token'] ||
        req.headers['authorization'].split(' ')[1];
      const decoded = this.jwtService.verify(token);
      req.user = decoded;
      return true;
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException();
    }
  }
}

export default JwtAuthGuard; // 추가
