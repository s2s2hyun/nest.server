import { IsNotEmpty } from 'class-validator';

export class CreateBoardDto {
  @IsNotEmpty() // title 필드가 비어있지 않아야 함
  title: string;

  @IsNotEmpty() // description 필드가 비어있지 않아야 함
  description: string;
  imagePath: string;
}
