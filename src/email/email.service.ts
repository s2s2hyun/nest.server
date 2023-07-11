import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(data: {
    to: string;
    text: string;
    from?: string;
    subject?: string;
  }): Promise<any> {
    const { to = 's2s2hyun0703@gmail.com', subject, from, text } = data;

    try {
      const result = await this.mailerService.sendMail({
        to, // 이메일 받는 사람의 주소
        text, // 이메일의 내용
        subject,
        from: from || 'no-reply@example.com', // 보내는 사람의 이메일 주소
        replyTo: to, // 사용자가 입력한 이메일 주소
      });

      return result;
    } catch (error) {
      throw error;
    }
  }
}
