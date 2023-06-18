import { CreateBoardDto } from './dtos/create-board.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardType, BoardStatus } from './boards.model';
import { v1 as uuid } from 'uuid';
import { UpdateBoardDto } from './dtos/update-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './board.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
  ) {}
  //private 를 사용한 이유는 여기서 private 를 사용하지 않으면 다른 컴포넌트에서 이 board라는 배열을 변화를 줄수있기에 private 를 한것이다.
  private boards: BoardType[] = [];

  //위에 있는 boards 배열을 불러오는 함수
  async getAllBoards(): Promise<BoardType[]> {
    const boards = await this.boardRepository.find();
    const result = boards.map((board) => ({
      id: board.id.toString(),
      title: board.title,
      description: board.description,
      status: board.status,
      createdAt: board.createdAt,
      category: board.category,
    }));

    return Promise.resolve(result);
  }

  async createBoard(createBoardDto: CreateBoardDto): Promise<BoardType> {
    const { title, description } = createBoardDto;

    const board = new Board();
    board.title = title;
    board.description = description;
    board.id = uuid(); // generate a unique string ID
    board.status = BoardStatus.PUBLIC; // set the status property
    await this.boardRepository.save(board);

    const boardType: BoardType = {
      id: board.id.toString(),
      title: board.title,
      description: board.description,
      status: board.status,
      category: board.category,
      createdAt: board.createdAt.toString(),
    };

    return boardType; // cast Board entity to BoardType interface
  }

  async getBoardById(id: string): Promise<Board> {
    return await this.boardRepository.findOne({ where: { id: id } });
  }
  // 보드라는 배열안에 여러가지 게시글이 있는데 특정한 게시글을 찾아서 그 정보를 리턴해주는 메소드다.

  async deleteBoard(id: string): Promise<void> {
    const result = await this.boardRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Board with ID "${id}" not found`);
    }
  }

  async updateBoardStatus(id: string, status: BoardStatus): Promise<BoardType> {
    const board = await this.getBoardById(id);
    board.status = status;
    return board;
  }

  async updateBoard(
    id: string,
    updateBoardDto: UpdateBoardDto,
  ): Promise<Board> {
    const { title, description, status } = updateBoardDto;
    const board = await this.getBoardById(id);
    if (title) {
      board.title = title;
    }
    if (description) {
      board.description = description;
    }
    if (status) {
      board.status = status;
    }
    return this.boardRepository.save(board);
  }
}
