import { ConfigService } from "@nestjs/config";
import { MailService } from '@sendgrid/mail';
import { SENDGRID_MAIL } from './mail.constant';

const TIME_OUT_EMAIL = 5000;

export const MailSengridProvider = [
  {
    provide: SENDGRID_MAIL,
    useFactory: (configService: ConfigService): MailService =>
    {
      const mail = new MailService();
      mail.setApiKey( configService.get<string>('SENDGRID_API_KEY') );
      mail.setTimeout(TIME_OUT_EMAIL);
      return mail;
    },
    inject: [ConfigService]
  }
];
