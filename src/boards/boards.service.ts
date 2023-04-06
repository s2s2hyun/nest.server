import { CreateBoardDto } from './dto/create-board.dto';
import { Injectable } from '@nestjs/common';
import { Board, BoardStatus } from './boards.model';
import { v1 as uuid } from 'uuid';
@Injectable()
export class BoardsService {
  //private 를 사용한 이유는 여기서 private 를 사용하지 않으면 다른 컴포넌트에서 이 board라는 배열을 변화를 줄수있기에 private 를 한것이다.
  private boards: Board[] = [];

  //위에 있는 boards 배열을 불러오는 함수
  getAllBoards(): Board[] {
    return this.boards;
  }

  createBoard(createBoardDto: CreateBoardDto) {
    const { title, description } = createBoardDto;
    const board: Board = {
      id: uuid(),
      title,
      description,
      status: BoardStatus.PUBLIC,
    };

    this.boards.push(board);
    console.log(board); // Add this line to debug
    return board;
  }

  getBoardById(id: string): Board {
    return this.boards.find((board) => board.id === id);
  }

  deleteBoard(id: string): void {
    this.boards = this.boards.filter((board) => board.id !== id);
  }
}
