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

  // @Post('/')
  // @UseInterceptors(FileInterceptor('image'))
  // async createBoard(
  //   @Body() createBoardDto: CreateBoardDto,
  //   @UploadedFile() image: Express.Multer.File,
  // ): Promise<BoardType> {
  //   try {
  //     // Get the file name
  //     const imageName = uuid() + path.extname(image.originalname);

  //     // Move the uploaded image file to the images folder
  //     const imagePath = path.join(
  //       __dirname,
  //       '..',
  //       '..',
  //       'public',
  //       'images',
  //       imageName,
  //     );
  //     console.log('Image Path:', imagePath); // Add this line to check the image path
  //     await fsPromises.rename(image.path, imagePath);

  //     // Create the board with the image path
  //     const createdBoard = await this.boardsService.createBoard({
  //       ...createBoardDto,
  //       imagePath: `/images/${imageName}`,
  //     });

  //     console.log('Created Board:', createdBoard); // Add this line to check the created board
  //     return createdBoard;
  //   } catch (err) {
  //     console.log('Error:', err); // Add this line to log the error
  //     if (err instanceof HttpException) {
  //       throw err;
  //     } else {
  //       throw new HttpException(
  //         'Internal Server Error',
  //         HttpStatus.INTERNAL_SERVER_ERROR,
  //       );
  //     }
  //   }
  // }

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
