import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { CommentsService } from './boardComment.service';

@Controller('boards/:boardId/comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Post()
  create(@Body() commentData, @Param('boardId') boardId: string) {
    return this.commentsService.create(boardId, commentData);
  }

  @Get()
  findAll(@Param('boardId') boardId: string) {
    return this.commentsService.findAllByBoardId(boardId);
  }
}
