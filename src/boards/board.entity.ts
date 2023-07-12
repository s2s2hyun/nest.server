import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { BoardStatus } from './boards.model';
import { Comment } from './boardComment.entity';

@Entity('boards') // Specify the table name as 'boards'
export class Board {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: BoardStatus.PUBLIC })
  status: BoardStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  writer: string;

  @Column({ default: 'SomeDefaultCategory' })
  category: string;

  @OneToMany(() => Comment, (comment) => comment.board)
  comments: Comment[];
}
