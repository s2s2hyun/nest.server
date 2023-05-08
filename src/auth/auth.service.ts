import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from './dtos/auth-credential.dto';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios'; // 추가
import { ConfigService } from '@nestjs/config'; // 추가
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService, // Add this line
    private readonly httpService: HttpService, // 추가
    private readonly configService: ConfigService, // 추가
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password, email } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      username,
      password: hashedPassword,
      email,
    });
    try {
      await this.userRepository.save(user);
      return 'success';
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Username already exists');
      } else {
        throw error;
      }
    }
  }

  async logIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const { username, password } = authCredentialsDto;
    const user = await this.userRepository.findOne({ where: { username } });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        const payload = { username: user.username };
        const access_token = this.jwtService.sign(payload);

        // 새로운 페이로드를 만들거나 기존 페이로드에 정보를 추가할 수 있습니다.
        const refreshPayload = { ...payload, refresh: true };
        const refresh_token = this.jwtService.sign(refreshPayload); // Use jwtService instead of jwtRefreshService

        return { access_token, refresh_token };
      } else {
        throw new UnauthorizedException('Invalid credentials');
      }
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  // authService에 kakaoLogin 메소드 추가
  async kakaoLogin(
    code: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const kakaoTokenUrl = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${this.configService.get(
      'KAKAO_REST_API_KEY',
    )}&redirect_uri=${this.configService.get(
      'KAKAO_REDIRECT_URI',
    )}&code=${code}&client_secret=${this.configService.get(
      'KAKAO_CLIENT_SECRET',
    )}`;

    const tokenRes = await this.httpService.post(kakaoTokenUrl).toPromise();
    const accessToken = tokenRes.data.access_token;

    const kakaoUserInfoUrl = 'https://kapi.kakao.com/v2/user/me';
    const userInfoRes = await this.httpService
      .get(kakaoUserInfoUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .toPromise();

    const kakaoId = userInfoRes.data.id;
    const email = userInfoRes.data.kakao_account.email;

    let user = await this.userRepository.findOne({
      where: { kakaoId: String(kakaoId) },
    });

    if (!user) {
      user = this.userRepository.create({
        kakaoId: String(kakaoId),
        email,
      });
      await this.userRepository.save(user);
    }

    const payload = { username: user.username };
    const access_token = this.jwtService.sign(payload);

    const refreshPayload = { ...payload, refresh: true };
    const refresh_token = this.jwtService.sign(refreshPayload);

    return { access_token, refresh_token };
  }
}
