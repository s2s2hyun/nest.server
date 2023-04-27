import { Module } from '@nestjs/common';
import { BoardsModule } from './boards/boards.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './boards/board.entity';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/user.entity';
import { ProtectedController } from './auth/protected.controller';

@Module({
  imports: [
    BoardsModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Qwe123123!',
      database: 'boards',
      entities: [Board, User],
      synchronize: true,
      logging: true, // enable logging
      // Add this line to use mysql2
      driver: require('mysql2'),
    }),
    AuthModule,
  ],
  controllers: [ProtectedController],
})
export class AppModule {}
