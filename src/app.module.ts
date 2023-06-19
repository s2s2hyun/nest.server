import { Module } from '@nestjs/common';
import { BoardsModule } from './boards/boards.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './boards/board.entity';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/user.entity';
import { Comment } from './boards/boardComment.entity';
import { ProtectedController } from './auth/protected.controller';
import { EmailModule } from './email/email.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    BoardsModule,
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Board, User, Comment],
      synchronize: true,
      logging: true, // enable logging
      // Add this line to use mysql2
      driver: require('mysql2'),
    }),
    AuthModule,
    EmailModule,
    MulterModule.register({ dest: 'uploads/' }), // Add this line
  ],
  controllers: [ProtectedController],
})
export class AppModule {}
