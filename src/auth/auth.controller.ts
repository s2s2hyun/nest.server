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
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dtos/auth-credential.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Response } from 'express';
import { Request } from 'express'; // 추가

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
    @Res({ passthrough: true }) response: Response, // 추가
  ): Promise<{ message: string }> {
    // 반환 타입 변경
    try {
      const { access_token, refresh_token } = await this.authService.logIn(
        authCredentialsDto,
      );

      // 쿠키 설정 추가
      response.cookie('access_token', access_token, { httpOnly: true });
      response.cookie('refresh_token', refresh_token, { httpOnly: true });

      return { message: 'Logged in successfully' }; // 반환 값 변경
    } catch (error) {
      throw new UnauthorizedException('login failed');
    }
  }
  @Post('/logout')
  async logout(
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string }> {
    // Clear the access_token and refresh_token cookies
    response.clearCookie('access_token', { httpOnly: true });
    response.clearCookie('refresh_token', { httpOnly: true });

    return { message: 'Logged out successfully' };
  }

  @Get('/oauth/callback/kakao')
  async kakaoCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string }> {
    try {
      const code = req.query.code as string; // 수정
      const { access_token, refresh_token } = await this.authService.kakaoLogin(
        code,
      );

      // 쿠키 설정 추가
      response.cookie('access_token', access_token, { httpOnly: true });
      response.cookie('refresh_token', refresh_token, { httpOnly: true });

      return { message: 'Logged in with Kakao successfully' };
    } catch (error) {
      throw new UnauthorizedException('Kakao login failed');
    }
  }

  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req) {
    return req.user;
  }
}
