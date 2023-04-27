import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dtos/auth-credential.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @UsePipes(new ValidationPipe())
  async signUp(
    @Body() authcredentialsDto: AuthCredentialsDto,
  ): Promise<{ message: string }> {
    const result = await this.authService.signUp(authcredentialsDto);
    return { message: result };
  }

  @Post('/login')
  async logIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ message: string }> {
    try {
      const username = await this.authService.logIn(authCredentialsDto);
      return { message: 'login success' };
    } catch (error) {
      console.log(`login failed for username: ${authCredentialsDto.username}`);
      throw new UnauthorizedException('login failed');
    }
  }
}
