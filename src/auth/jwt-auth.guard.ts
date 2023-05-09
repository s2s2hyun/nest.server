import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      'public',
      context.getHandler(),
    );
    if (isPublic) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const token = req.cookies?.access_token;
    // console.log(req, 'req');
    // console.log(token, '토큰');
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const decoded = this.jwtService.verify(token);
      req.user = decoded;
      return true;
    } catch (err) {
      console.log(err, '이거야?');
      throw new UnauthorizedException();
    }
  }
}

export default JwtAuthGuard;
