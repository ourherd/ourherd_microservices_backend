import { Injectable, Logger } from '@nestjs/common';
import { IServiceResponse } from '@app/rabbit';
import { WelcomeMailerDto } from './dto/welcome.mailer.dto';
import { SendMailerDto } from './dto/send.mailer.dto';
import { MAILER_MODULE, MAILER_SERVICE } from './constant/mailer-patterns.constants';
import { SendgridService } from './services/sendgrid.service';
import { ClientResponse } from '@sendgrid/mail';

@Injectable()
export class MailerServiceExt {
  private logger = new Logger(MAILER_SERVICE);
  private fromEmail = 'hello@ourherd.io';

  constructor(
    private readonly sendgridService: SendgridService
    ) { }

  public async welcomeEmail(welcomeMailerDto: WelcomeMailerDto): Promise<IServiceResponse<ClientResponse>> {
    try {

      let mailOptions = {
        to: welcomeMailerDto.email,
        from: this.fromEmail,
        templateId: 'd-efce47c71e544ae19da295c4f83d1667'
      }

      const sent = await this.sendgridService.send(mailOptions);

      return {
        state: !!sent,
        data: sent[0]
      };

    } catch (err) {
      this.logger.log(MAILER_MODULE + ' Error: ' + err);

      return {
        state: false,
        data: err.name
      };
    }



  }

  public async sendEmail(sendMailerDto: SendMailerDto): Promise<IServiceResponse<ClientResponse>> {

    try {
      

      if (!!sendMailerDto.email == false) {
        return {
          state: false,
          data: {
            statusCode: 400,
            body: sendMailerDto,
            headers: null
          }
        };
      }

      console.log(sendMailerDto);
      
      
      let mailOptions = {
        to: sendMailerDto.email,
        from: this.fromEmail,
        subject: sendMailerDto.subject,
        text: "Hello",
        html: sendMailerDto.html,
      }

      const sent = await this.sendgridService.send(mailOptions);

      this.logger.log(MAILER_MODULE + ' sent: ' + sent);

      return {
        state: !!sent,
        data: sent[0]
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
