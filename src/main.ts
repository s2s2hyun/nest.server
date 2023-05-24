import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser'; // Add this line
async function bootstrap() {
  dotenv.config(); // Add this line to load .env file
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  // // CORS 모든 설정 활성화
  // app.enableCors();

  // CORS 설정을 커스텀 수정
  app.enableCors({
    origin: 'http://localhost:3000', // 클라이언트 애플리케이션의 도메인
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // 허용할 HTTP 메소드들
    allowedHeaders: ['Content-Type', 'Authorization'], // 허용할 헤더들
    credentials: true,
  });

  app.use(bodyParser.json({ limit: '10mb' }));

  app.use(
    '/images',
    express.static(path.join(__dirname, '..', 'public', 'images')),
  );

  await app.listen(process.env.PORT);
}
bootstrap();
