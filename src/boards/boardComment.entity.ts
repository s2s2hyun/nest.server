import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  RelationId,
} from 'typeorm';
import { Board } from './board.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @Column()
  email: string;

  @Column()
  nickname: string;

  @Column()
  createdAt: Date;

  @Column()
  boardId: string;

  @ManyToOne(() => Board, (board) => board.comments)
  @JoinColumn({ name: 'boardId' })
  board: Board;
}
