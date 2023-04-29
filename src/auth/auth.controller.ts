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
  ): Promise<{ access_token: string }> {
    try {
      const token = await this.authService.logIn(authCredentialsDto);
      console.log('Token:', token);
      return token;
    } catch (error) {
      console.log(`Login failed for username: ${authCredentialsDto.username}`);
      console.log('Error:', error); // Add this line to log the error
      throw new UnauthorizedException('login failed');
    }
  }
}
