import { Module } from '@nestjs/common';
import { MailerController } from './mailer.controller';
import { MailerServiceExt } from './mailer.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { RabbitModule, RabbitServiceName } from '@app/rabbit';

@Module({
  imports: [
    RabbitModule.forServerProxy(RabbitServiceName.EMAIL),
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_ID, // generated ethereal user
          pass: process.env.EMAIL_PASS // generated ethereal password
        },
      },
      defaults: {
        from: '"nest-modules" <user@outlook.com>', // outgoing email ID
      },
      template: {
        dir: process.cwd() + '/apps/mailer/template/',
        adapter: new HandlebarsAdapter(), // or new PugAdapter()
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [MailerController],
  providers: [MailerServiceExt],
})
export class MailerModuleExt {}
