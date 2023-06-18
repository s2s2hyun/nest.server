import { IsString, IsNotEmpty } from 'class-validator';

export class CreateBoardDto {
  @IsNotEmpty() // title 필드가 비어있지 않아야 함
  title: string;

  @IsNotEmpty() // description 필드가 비어있지 않아야 함
  description: string;
  imagePath: string;

  @IsString() // 변경: @IsOptional 제거
  category: string; // 변경: 필수 필드이므로 ? 제거
}
