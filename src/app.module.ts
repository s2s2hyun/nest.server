import { Module } from '@nestjs/common';
import { BoardsModule } from './boards/boards.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './boards/board.entity';

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
      entities: [Board],
      synchronize: true,
      logging: true, // enable logging
      // Add this line to use mysql2
      driver: require('mysql2'),
    }),
  ],
})
export class AppModule {}
