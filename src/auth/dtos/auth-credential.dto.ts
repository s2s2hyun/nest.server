import { IsString, MinLength, MaxLength } from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  @MinLength(4) // Set the minimum length for the username
  @MaxLength(20) // Set the maximum length for the username
  username: string;

  @IsString()
  @MinLength(6) // Set the minimum length for the username
  @MaxLength(20)
  password: string;

  @IsString()
  @MaxLength(30)
  email: string;
}
