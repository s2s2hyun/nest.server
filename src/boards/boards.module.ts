import { Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { CommentsController } from './boardComment.controller';
import { CommentsService } from './boardComment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './board.entity';
import { Comment } from './boardComment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Board, Comment])],
  controllers: [BoardsController, CommentsController],
  providers: [BoardsService, CommentsService],
})
export class BoardsModule {}
