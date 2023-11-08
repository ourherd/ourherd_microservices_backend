import { Injectable, Inject } from '@nestjs/common';
import { MailService, MailDataRequired } from '@sendgrid/mail';
import { SENDGRID_MAIL } from './mail.constant';
import { Observable, from } from 'rxjs';

@Injectable()
export class MailSengridService {

  constructor(@Inject(SENDGRID_MAIL) private mailService: MailService) { }

  send(data: MailDataRequired): Observable<any>{
    return from(this.mailService.send(data, false))
  }

}
