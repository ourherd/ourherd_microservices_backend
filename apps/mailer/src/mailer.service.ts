import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { IServiceResponse } from '@app/rabbit';
import { WelcomeMailerDto } from './dto/welcome.mailer.dto';
import { SendMailerDto } from './dto/send.mailer.dto';
import { HTTP_CODE_METADATA } from '@nestjs/common/constants';

@Injectable()
export class MailerServiceExt {

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
      console.log("Error:", err);

      return {
        state: false,
        data: err.name
      };
    }



  }

  public async sendEmail(sendMailerDto: SendMailerDto): Promise<IServiceResponse<boolean>> {

    try {
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

      console.log('Mailler sent: %s', sent);

      return {
        state: sent,
        data: null
      };
    }
    catch (error) {
      console.log('Mailler sent Error: %s', error);
      return {
        state: false,
        data: error.name
      };
    }


  }
}
