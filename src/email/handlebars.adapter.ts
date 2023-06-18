import { TemplateAdapter } from '@nestjs-modules/mailer/dist/interfaces/template-adapter.interface';
import { MailerOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-options.interface';
import * as handlebars from 'handlebars';
import * as fs from 'fs';

export class HandlebarsAdapter implements TemplateAdapter {
  public compile(mail: any, callback: any, options: MailerOptions): void {
    const templatePath = options.template?.dir;
    fs.readFile(
      templatePath + '/' + mail.data.template + '.hbs',
      'utf-8',
      (err, data) => {
        if (err) {
          return callback(err);
        }

        const template = handlebars.compile(data);
        mail.data.html = template(mail.data.context);
        return callback();
      },
    );
  }
}
