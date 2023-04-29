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
  ): Promise<{ access_token: string }> {
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    const { username, password } = authCredentialsDto;
    const user = await this.userRepository.findOne({ where: { username } });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      console.log('Password match:', isMatch);

      if (isMatch) {
        const payload = { username: user.username };
        const access_token = this.jwtService.sign(payload);
        console.log('Access token:', access_token);

        return { access_token };
      } else {
        console.log('Login failed: password mismatch'); // Add this line
        throw new UnauthorizedException('Invalid credentials');
      }
    } else {
      console.log('Login failed: user not found'); // Add this line
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
