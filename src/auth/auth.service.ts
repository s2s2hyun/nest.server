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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService, // Add this line
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      username,
      password: hashedPassword,
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
}
