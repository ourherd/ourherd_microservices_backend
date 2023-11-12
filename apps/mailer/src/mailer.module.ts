import { Module } from '@nestjs/common';
import { MailerController } from './mailer.controller';
import { MailerServiceExt } from './mailer.service';
import { RabbitModule, RabbitServiceName } from '@app/rabbit';
import { SendgridService } from './services/sendgrid.service';
import { MailService } from '@sendgrid/mail';

@Module({
  imports: [
    RabbitModule.forServerProxy(RabbitServiceName.MAILER),
  ],
  controllers: [MailerController],
  providers: [
    MailerServiceExt,
    SendgridService,
    MailService
  ],
})
export class MailerModuleExt {}
