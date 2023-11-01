import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { IServiceResponse } from '@app/rabbit';
import { WelcomeMailerDto } from './dto/welcome.mailer.dto';
import { SendMailerDto } from './dto/send.mailer.dto';
import { MAILER_MODULE, MAILER_SERVICE } from './constant/mailer-patterns.constants';


@Injectable()
export class MailerServiceExt {
  private logger = new Logger(MAILER_SERVICE);

  constructor(private readonly mailerService: MailerService) { }

  public async welcomeEmail(welcomeMailerDto: WelcomeMailerDto): Promise<IServiceResponse<String>> {
    try {

      let mailOptions = {
        to: welcomeMailerDto.email,
        from: 'papatpon@batyr.com.au',
        subject: 'Testing Nest Mailermodule with template ✔',
        template: 'welcome',
        context: {},
      }

      var sent = await this.mailerService
        .sendMail(mailOptions)
        .then((success) => {
          this.logger.log(MAILER_MODULE + ' sent: ' + success);
          return success
        })
        .catch((err) => {
          throw new HttpException(err, HttpStatus.BAD_REQUEST);
        });

      return {
        state: sent,
        data: "SUCCESS"
      };

    } catch (err) {
      this.logger.log(MAILER_MODULE + ' Error: ' + err);

      return {
        state: false,
        data: err.name
      };
    }



  }

  public async sendEmail(sendMailerDto: SendMailerDto): Promise<IServiceResponse<boolean>> {

    try {

      if (!!sendMailerDto.email == false) {
        return {
          state: false,
          data: null
        };
      }
      let mailOptions = {
        to: sendMailerDto.email,
        from: 'papatpon@batyr.com.au',
        subject: sendMailerDto.subject,
        text: "",
        html: sendMailerDto.html,
        context: {},
      }

      var sent = await this.mailerService
        .sendMail(mailOptions)
        .then((success) => {
          return success
        })
        .catch((err) => {
          throw new HttpException(err, HttpStatus.BAD_REQUEST);
        });

      this.logger.log(MAILER_MODULE + ' sent: ' + sent);

      return {
        state: sent,
        data: null
      };
    }
    catch (error) {
      this.logger.log(MAILER_MODULE + ' sent Error: ' + error);
      return {
        state: false,
        data: error.name
      };
    }


  }
}
