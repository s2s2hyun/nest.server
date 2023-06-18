import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['username', 'email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ nullable: true })
  password: string;
  @Column({ default: '' })
  email: string;

  // 소셜 로그인은 블로그에 사용X
  @Column({ nullable: true })
  kakaoId: string; // 이 줄을 추가해주세요.

  @Column({ nullable: true })
  naverId: string; // 이 줄을 추가해주세요.
  @Column({ nullable: true })
  googleId: string; // 이 줄을 추가해주세요.
}
