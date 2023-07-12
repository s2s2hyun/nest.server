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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardType, BoardStatus } from './boards.model';
import { CreateBoardDto } from './dtos/create-board.dto';
import { UpdateBoardDto } from './dtos/update-board.dto';
import { Board } from './board.entity';
import { v4 as uuid } from 'uuid';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fsPromises from 'fs/promises';
import * as path from 'path';
import { diskStorage } from 'multer';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './boardComment.entity';

@Controller('boards')
export class BoardsController {
  constructor(
    private boardsService: BoardsService,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  @Get('/')
  async getAllBoard(): Promise<BoardType[]> {
    const boards = await this.boardsService.getAllBoards();
    // boards.forEach((board) => console.log(board.id)); // Log the id of each board
    return boards.map((board) => ({
      id: board.id,
      title: board.title,
      description: board.description,
      status: board.status,
      category: board.category,
      createdAt: board.createdAt.toString(),
      writer: board.writer,
      commentCount: board.commentCount,
    }));
  }

  @Post('/')
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

      const commentCount = await this.commentRepository
        .createQueryBuilder('comment')
        .where('comment.boardId = :id', { id })
        .getCount();

      return {
        id: board.id.toString(),
        title: board.title,
        description: board.description,
        status: board.status,
        category: board.category,
        createdAt: board.createdAt.toString(),
        writer: board.writer,
        commentCount,
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

  @Post('/upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/images', // 이미지를 저장할 디렉토리 경로
        filename: (req, file, callback) => {
          const uniqueName = uuid() + path.extname(file.originalname);
          callback(null, uniqueName);
        },
      }),
    }),
  )
  async uploadImage(@UploadedFile() image: Express.Multer.File) {
    const imageUrl = `/images/${image.filename}`;
    return { imageUrl };
  }
}
// 확인
