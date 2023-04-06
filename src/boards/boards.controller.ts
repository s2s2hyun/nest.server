import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { Board } from './boards.model';
import { CreateBoardDto } from './dto/create-board.dto';

@Controller('boards')
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  @Get('/')
  getAllBoard(): Board[] {
    return this.boardsService.getAllBoards();
  }

  @Post()
  async createBoard(@Body() createBoardDto: CreateBoardDto): Promise<Board> {
    try {
      const createdBoard = this.boardsService.createBoard(createBoardDto);
      return createdBoard;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      } else {
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Get('/:id')
  async getBoardById(@Param('id') id: string): Promise<Board> {
    try {
      const board = await this.boardsService.getBoardById(id);
      if (!board) {
        throw new HttpException('Board not found', HttpStatus.NOT_FOUND);
      }
      return board;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      } else {
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // getBoardById(@Param() params: string[]): Board {
  //   return this.boardsService.getBoardById(id);
  // }

  @Delete('/:id')
  deleteBoard(@Param('id') id: string): void {
    this.boardsService.deleteBoard(id);
  }
}
