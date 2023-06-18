import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: 'Gmail',
        auth: {
          user: 's2s2hyun0703@gmail.com',
          pass: 'qiwwttetnulowubv',
        },
      },
      defaults: {
        from: '"nest-modules" <s2s2hyun0703@gmail.com>',
      },
    }),
  ],
  providers: [EmailService],
  controllers: [EmailController],
})
export class EmailModule {}
