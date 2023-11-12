import { Body, Controller, Inject, Post } from "@nestjs/common";
import { IGatewayResponse } from '../../common/interface/gateway.interface';
import { IServiceResponse, RabbitServiceName } from "@app/rabbit";
import { AccountEntity } from 'apps/account/src/entity/account.entity';
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { firstValueFrom } from "rxjs";
import { ClientProxy } from "@nestjs/microservices";
import { WelcomeMailerDto } from "apps/mailer/src/dto/welcome.mailer.dto";
import { MAILER_MESSAGE_PATTERNS } from "apps/mailer/src/constant/mailer-patterns.constants";

@ApiTags('Mailer Gateway')
@Controller({
  path: '/mailer'
})

export class MailerGatewayController {

  constructor(
    @Inject(RabbitServiceName.MAILER) private mailerClient: ClientProxy,
    ) { }

  @Post('/welcome-email')
  @ApiOperation({ summary: 'send welcome email' })
  @ApiResponse({ status: 200, description: "send email from email template for welcoming new member" })
  async welcomeEmail (
    @Body() welcomeMailerDto: WelcomeMailerDto
    ): Promise<IGatewayResponse> {
    const { state, data } = await firstValueFrom(
      this.mailerClient.send<IServiceResponse<AccountEntity>, { welcomeMailerDto: WelcomeMailerDto}>
      (
        MAILER_MESSAGE_PATTERNS.WELCOME_EMAIL_REQUEST_SENT,
        {
          welcomeMailerDto
        }
      )
    );

    return { state, data };
  }

}
