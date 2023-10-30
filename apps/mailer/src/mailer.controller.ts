import { Controller } from '@nestjs/common';
import { MailerServiceExt } from './mailer.service';
import { MAILER_MESSAGE_PATTERNS } from './constant/mailer-patterns.constants';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IServiceResponse } from '@app/rabbit';
import { WelcomeMailerDto } from './dto/welcome.mailer.dto';

@Controller()
export class MailerController {
  constructor(private readonly mailerService: MailerServiceExt) {}

  @MessagePattern(MAILER_MESSAGE_PATTERNS.WELCOME_EMAIL_REQUEST_SENT)
  async sendMailWelcome(
    @Payload('welcomeMailerDto') welcomeMailerDto: WelcomeMailerDto): Promise<IServiceResponse<String>> {
    const mailerResult = this.mailerService.welcomeEmail(welcomeMailerDto)    
    return mailerResult
  }
}
