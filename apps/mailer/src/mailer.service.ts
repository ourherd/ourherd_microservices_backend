import { Injectable, Logger } from "@nestjs/common";
import { IServiceResponse } from "@app/rabbit";
import { MAILER_SERVICE } from "./constant/mailer-patterns.constants";
import { MailSengridService } from "@app/mail/mail.sengrid.service";
import { EmailEnum, IEmailTemplate, TemplateMap } from "./constant/template-map-constants";
import { mailOptionsData } from "./mailer.util";
import { ConfigService } from "@nestjs/config";
import { RegisterAccountDto } from "../../account/src/dto/register.account.dto";
import { EmailVerifyTokenDto } from "../../member/src/dto/email-verify-token.account.dto";


@Injectable()
export class MailerService {
  private logger = new Logger(MAILER_SERVICE);

  constructor(private configService: ConfigService,
              private readonly mailService: MailSengridService) { }

  public async sendWelcomeEmail( registerDto: RegisterAccountDto ) {

    const mailOptions = mailOptionsData( registerDto.email, EmailEnum.WELCOME, this.configService);

    try {
      await this.mailService.send( mailOptions );
      this.logger.log('Mail sent ' + EmailEnum.WELCOME + ' to '+ JSON.stringify(registerDto.email));
    } catch (e) {
      this.logger.log('MAILER welcome email - error: ' + JSON.stringify(e));
    }
  }

  public async sendEmailVerification ( verifyDto: EmailVerifyTokenDto | RegisterAccountDto ) {

    const mailOptions = mailOptionsData( verifyDto.email, EmailEnum.VERIFY_EMAIL,
            this.configService, verifyDto.token );
    try {
      await this.mailService.send( mailOptions );
      this.logger.log('Mail sent ' + EmailEnum.VERIFY_EMAIL + ' to '+ JSON.stringify(verifyDto.email));

    } catch (e) {
      this.logger.log('MAILER verification email - error: ' + JSON.stringify(e));
    }
  }

  public async sendEmailModerationMessage (email: string, template: EmailEnum ){

    const mailOptions = mailOptionsData( email, template, this.configService );
    try {
      await this.mailService.send( mailOptions );
      this.logger.log('Mail sent ' + EmailEnum.MODERATION_MESSAGE + ' to '+ JSON.stringify(email));
    } catch (e) {
      this.logger.log('MAILER verification email - error: ' + JSON.stringify(e));
    }
  }

}
