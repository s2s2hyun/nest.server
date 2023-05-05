import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UnauthorizedException,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dtos/auth-credential.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

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
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
      const tokens = await this.authService.logIn(authCredentialsDto);
      console.log('Token:', tokens);
      return tokens;
    } catch (error) {
      console.log(`Login failed for username: ${authCredentialsDto.username}`);
      console.log('Error:', error); // Add this line to log the error
      throw new UnauthorizedException('login failed');
    }
  }

  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req) {
    return req.user;
  }
}
