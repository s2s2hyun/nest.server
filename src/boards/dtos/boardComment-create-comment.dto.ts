import { IsString, IsEmail } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  content: string;

  @IsEmail()
  email: string;

  @IsString()
  nickname: string;
}
