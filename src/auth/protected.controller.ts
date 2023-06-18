import { Controller, Get } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('protected')
export class ProtectedController {
  @Get()
  @UseGuards(AuthGuard('jwt')) // Protect this route with the JwtStrategy
  getProtectedResource(): string {
    return 'This route is protected and requires a valid JWT token';
  }
}
