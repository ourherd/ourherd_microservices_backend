import { Injectable, Logger } from "@nestjs/common";
import { IServiceResponse } from "@app/rabbit";
import { MAILER_SERVICE } from "./constant/mailer-patterns.constants";
import { MailSengridService } from "@app/mail/mail.sengrid.service";
import { EmailEnum, IEmailTemplate, TemplateMap } from "./constant/template-map-constants";
import { ConfigService } from "@nestjs/config";
import { v4 } from "uuid";
import { RegisterAccountDto } from "../../account/src/dto/register.account.dto";
import { EmailVerifyTokenDto } from "../../member/src/dto/email-verify-token.account.dto";


@Injectable()
export class MailerService {
  private logger = new Logger(MAILER_SERVICE);

  constructor(private configService: ConfigService,
              private readonly mailService: MailSengridService) { }

  public async sendWelcomeEmail( registerDto: RegisterAccountDto ): Promise<IServiceResponse<any>> {
    const mailOptions = this.mailOptionsData( registerDto, EmailEnum.WELCOME );
    this.logger.log('mailer options ' + JSON.stringify(mailOptions));

    try {
      const sent = await this.mailService.send( mailOptions );
      return {
        state: !!sent,
        data: sent[0]
      };
    } catch (e) {
      this.logger.log('MAILER welcome email - error: ' + JSON.stringify(e));
    }
  }

  public async sendEmailVerification ( verifyDto: EmailVerifyTokenDto | RegisterAccountDto ) {

    const link = this.createLink( EmailEnum.VERIFY_EMAIL, verifyDto.token );
    const mailOptions = this.mailOptionsData( verifyDto, EmailEnum.VERIFY_EMAIL, link );
    try {
      const sent = await this.mailService.send( mailOptions );
      return {
        state: !sent,
        data: sent[0]
      };
    } catch (e) {
      this.logger.log('MAILER verification email - error: ' + JSON.stringify(e));
    }
  }

  private mailOptionsData (registerDto: EmailVerifyTokenDto | RegisterAccountDto, template_name: string, link?: string) {

    const template = TemplateMap[template_name] as IEmailTemplate;

    const mailOptions = {
      to: registerDto.email,
      from: template.from,
      templateId: template.template_id,
      dynamic_template_data: {
        link : link
      },
    };

    return mailOptions;
  }

  private createLink( emailType : EmailEnum, token?: string): any {
    switch ( emailType ) {
      case EmailEnum.WELCOME:
        return this.configService.get('LINK_EMAIL_VALIDATION_URL') + token;
      case EmailEnum.RESET_PASSWORD:
        return this.configService.get('LINK_RESET_PASSWORD_URL') + token;
      case EmailEnum.VERIFY_EMAIL:
        return this.configService.get('LINK_EMAIL_VALIDATION_URL') + token;
      default:
        console.log("No such day exists!");
        break;
    }
  }

}
