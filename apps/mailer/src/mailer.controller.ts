import { Controller, Logger } from '@nestjs/common';
import { MailerServiceExt } from './mailer.service';
import { MAILER_MESSAGE_PATTERNS, MAILER_SERVICE } from './constant/mailer-patterns.constants';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IServiceResponse } from '@app/rabbit';
import { WelcomeMailerDto } from './dto/welcome.mailer.dto';
import { SendMailerDto } from './dto/send.mailer.dto';
import { ClientResponse } from '@sendgrid/mail';

@Controller()
export class MailerController {

  private logger = new Logger(MAILER_SERVICE);

  constructor(private readonly mailerService: MailerServiceExt) {}

  @MessagePattern(MAILER_MESSAGE_PATTERNS.WELCOME_EMAIL_REQUEST_SENT)
  async sendMailWelcome(
    @Payload('welcomeMailerDto') welcomeMailerDto: WelcomeMailerDto): Promise<IServiceResponse<ClientResponse>> {
    const mailerResult = this.mailerService.welcomeEmail(welcomeMailerDto)    
    return mailerResult
  }
  
  @MessagePattern(MAILER_MESSAGE_PATTERNS.EMAIL_SENT)
  async sendMail(
    @Payload('sendMailerDtoData') sendMailerDto: SendMailerDto): Promise<IServiceResponse<ClientResponse>> {
    this.logger.log('Start sending message');
    const mailerResult = this.mailerService.sendEmail(sendMailerDto)    
    this.logger.log('Stop sending message');
    return mailerResult
  }
}
