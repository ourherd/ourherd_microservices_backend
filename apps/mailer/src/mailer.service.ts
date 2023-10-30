import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { IServiceResponse } from '@app/rabbit';
import { WelcomeMailerDto } from './dto/welcome.mailer.dto';

@Injectable()
export class MailerServiceExt {

  constructor(private readonly mailerService: MailerService) { }

  public async welcomeEmail(welcomeMailerDto: WelcomeMailerDto): Promise<IServiceResponse<String>> {
    try {
      try {
        const success = await this
          .mailerService
          .sendMail({
            to: welcomeMailerDto.email,
            from: 'papatpon@batyr.com.au',
            subject: 'Testing Nest Mailermodule with template ✔',
            template: 'welcome',
            context: {},
          });
        return {
          state: true,
          data: "SUCCESS"
        };
      } catch (err) {
        console.log("Error:", err);
        
        return {
          state: false,
          data: err.name
        };
      }


    } catch (error) {
      console.log("Error:", error);
      return {
        state: false,
        data: error.name
      };
    }

  }
}
