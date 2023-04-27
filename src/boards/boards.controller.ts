import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  HttpException,
  HttpStatus,
  Patch,
  Put,
  NotFoundException,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardType, BoardStatus } from './boards.model';
import { CreateBoardDto } from './dtos/create-board.dto';
import { UpdateBoardDto } from './dtos/update-board.dto';
import { Board } from './board.entity';

@Controller('boards')
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  @Get('/')
  async getAllBoard(): Promise<BoardType[]> {
    const boards = await this.boardsService.getAllBoards();
    return boards.map((board) => ({
      id: board.id,
      title: board.title,
      description: board.description,
      status: board.status,
    }));
  }

  @Post()
  async createBoard(
    @Body() createBoardDto: CreateBoardDto,
  ): Promise<BoardType> {
    try {
      const createdBoard = await this.boardsService.createBoard(createBoardDto);
      console.log(createdBoard);
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
  async getBoardById(@Param('id') id: string): Promise<BoardType> {
    try {
      const board = await this.boardsService.getBoardById(id);
      if (!board) {
        throw new NotFoundException({ message: 'Board not found', id });
      }
      return {
        id: board.id.toString(),
        title: board.title,
        description: board.description,
        status: board.status,
      };
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

  @Patch('/:id/status')
  updateBoardStatus(
    @Param('id') id: string,
    @Body('status') status: BoardStatus,
  ) {
    return this.boardsService.updateBoardStatus(id, status);
  }

  @Put('/:id')
  async updateBoard(
    @Param('id') id: string,
    @Body() updateBoardDto: UpdateBoardDto,
  ): Promise<BoardType> {
    return this.boardsService.updateBoard(id, updateBoardDto);
  }
}
