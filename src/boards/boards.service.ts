import { CreateBoardDto } from './dtos/create-board.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardType, BoardStatus } from './boards.model';
import { v1 as uuid } from 'uuid';
import { UpdateBoardDto } from './dtos/update-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './board.entity';
import { Comment } from './boardComment.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}
  //private 를 사용한 이유는 여기서 private 를 사용하지 않으면 다른 컴포넌트에서 이 board라는 배열을 변화를 줄수있기에 private 를 한것이다.
  private boards: BoardType[] = [];

  //위에 있는 boards 배열을 불러오는 함수
  async getAllBoards(): Promise<BoardType[]> {
    const boards = await this.boardRepository.find();

    const result = boards.map(async (board) => {
      const commentCount = await this.commentRepository.count({
        where: { board: board },
      });

      return {
        id: board.id.toString(),
        title: board.title,
        description: board.description,
        status: board.status,
        createdAt: board.createdAt,
        category: board.category,
        writer: board.writer,
        commentCount: commentCount,
      };
    });

    return Promise.all(result);
  }

  async createBoard(createBoardDto: CreateBoardDto): Promise<BoardType> {
    const { title, description, category, writer } = createBoardDto;

    const board = new Board();
    board.title = title;
    board.description = description;
    board.category = category;
    board.id = uuid(); // generate a unique string ID
    board.status = BoardStatus.PUBLIC;
    board.writer = writer; // set the status property
    await this.boardRepository.save(board);

    const commentCount = await this.boardRepository
      .createQueryBuilder('board')
      .leftJoinAndSelect('board.comments', 'comments')
      .where('board.id = :id', { id: board.id })
      .getCount();

    const boardType: BoardType = {
      id: board.id.toString(),
      title: board.title,
      description: board.description,
      status: board.status,
      category: board.category,
      createdAt: board.createdAt.toString(),
      writer: board.writer,
      commentCount,
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
    await this.boardRepository.save(board);

    const commentCount = await this.boardRepository
      .createQueryBuilder('board')
      .leftJoinAndSelect('board.comments', 'comments')
      .where('board.id = :id', { id: board.id })
      .getCount();

    const boardType: BoardType = {
      id: board.id.toString(),
      title: board.title,
      description: board.description,
      status: board.status,
      category: board.category,
      createdAt: board.createdAt.toString(),
      writer: board.writer,
      commentCount,
    };

    return boardType;
  }

  async getCommentCountByBoardId(boardId: string): Promise<number> {
    const commentCount = await this.commentRepository
      .createQueryBuilder('comment')
      .where('comment.boardId = :boardId', { boardId })
      .getCount();

    return commentCount;
  }

  async updateBoard(
    id: string,
    updateBoardDto: UpdateBoardDto,
  ): Promise<BoardType> {
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

    // Comment count를 가져옵니다
    const commentCount = await this.getCommentCountByBoardId(id);

    // 수정된 게시판을 저장합니다
    const savedBoard = await this.boardRepository.save(board);

    // BoardType 형식에 맞게 반환합니다
    return {
      id: savedBoard.id.toString(),
      title: savedBoard.title,
      description: savedBoard.description,
      status: savedBoard.status,
      category: savedBoard.category,
      createdAt: savedBoard.createdAt.toString(),
      writer: savedBoard.writer,
      commentCount,
    };
  }
}
