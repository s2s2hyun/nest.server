import { BoardStatus } from '../boards.model';

export class UpdateBoardDto {
  title: string;
  description: string;
  status: BoardStatus;
}
