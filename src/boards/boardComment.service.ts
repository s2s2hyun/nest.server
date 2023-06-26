import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './boardComment.entity';
import { CreateCommentDto } from './dtos/boardComment-create-comment.dto';
import { Board } from './board.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
  ) {}

  async create(
    boardId: string,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const board = await this.boardRepository.findOne({
      where: { id: boardId },
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    const comment = new Comment();
    comment.content = createCommentDto.content;
    comment.email = createCommentDto.email;
    comment.nickname = createCommentDto.nickname;
    comment.createdAt = new Date();
    comment.board = board;
    const picNumber = Math.floor(Math.random() * 17) + 1;
    comment.pic = `pic${picNumber}`;

    return this.commentRepository.save(comment);
  }

  async findAllByBoardId(boardId: string): Promise<Comment[]> {
    return this.commentRepository
      .createQueryBuilder('comment')
      .innerJoinAndSelect('comment.board', 'board', 'board.id = :id', {
        id: boardId,
      })
      .getMany();
  }
}
