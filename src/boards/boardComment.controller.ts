import { Controller, Post, Body, Param } from '@nestjs/common';
import { CommentsService } from './boardComment.service';

@Controller('boards/:boardId/comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Post()
  create(@Body() commentData, @Param('boardId') boardId: string) {
    // boardId를 사용하여 게시글을 찾고, 해당 게시글에 commentData를 추가합니다.
    return this.commentsService.create(boardId, commentData);
  }
}
