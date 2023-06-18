import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  async sendMail(@Body() body) {
    const { subject, text } = body;
    const from = body.from; // 사용자가 입력한 보내는 사람 이메일 주소

    return this.emailService.sendMail({
      to: 's2s2hyun0703@gmail.com', // 이메일 받는 사람의 주소 (고정)
      subject, // 이메일의 제목
      text, // 이메일의 내용
      from, // 사용자가 입력한 보내는 사람 이메일 주소
    });
  }
}
