import { Injectable } from '@nestjs/common';

@Injectable()
export class BoardsService {
  //private 를 사용한 이유는 여기서 private 를 사용하지 않으면 다른 컴포넌트에서 이 board라는 배열을 변화를 줄수있기에 private 를 한것이다.
  private boards = [];

  //위에 있는 boards 배열을 불러오는 함수
  getAllBoards() {
    return this.boards;
  }
}
