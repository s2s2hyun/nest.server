import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
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

  @ManyToOne(() => Board, (board) => board.comments)
  board: Board;
}
