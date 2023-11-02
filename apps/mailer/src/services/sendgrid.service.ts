import { Injectable } from '@nestjs/common';
import * as SendGrid from '@sendgrid/mail';

@Injectable()
export class SendgridService {
  constructor(
    private readonly mailService: SendGrid.MailService
  ) {
    // Don't forget this one.
    // The apiKey is required to authenticate our
    // request to SendGrid API.
    const key = process.env.SENDGRID_API_KEY
    this.mailService.setApiKey(key)
  }

  async send(mail: SendGrid.MailDataRequired) {
    const clientResponse= await this.mailService.send(mail);
    console.log(`E-Mail sent to ${mail.to}`);
    return clientResponse;
  }
}