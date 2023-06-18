import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BoardStatus } from './boards.model';

@Entity('boards') // Specify the table name as 'boards'
export class Board {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '기본값' })
  title: string;

  @Column({ default: '기본값' })
  description: string;

  @Column({ default: BoardStatus.PUBLIC })
  status: BoardStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: '기본값' })
  category: string;
}
