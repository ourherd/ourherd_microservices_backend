import { Body, Controller, Inject, Post } from "@nestjs/common";
import { IGatewayResponse } from '../../common/interface/gateway.interface';
import { IServiceResponse, RabbitServiceName } from "@app/rabbit";
import { AccountEntity } from 'apps/account/src/entity/account.entity';
import { RegisterAccountDto } from "apps/account/src/dto/register.account.dto";
import { ApiTags } from "@nestjs/swagger";
import { firstValueFrom } from "rxjs";
import { ACCOUNT_MESSAGE_PATTERNS } from "../../../../account/src/constant/account-patterns.constants";
import { ClientProxy } from "@nestjs/microservices";
import { LoginAccountDto } from "apps/account/src/dto/login.account.dto";
import { AuthChangePasswordUserDto } from "apps/account/src/dto/change-password.account.dto";
import { AuthForgotPasswordUserDto } from "apps/account/src/dto/reset-forget-password.dto";
import { AuthConfirmPasswordUserDto } from "apps/account/src/dto/reset-confirm-password.dto";
import { AuthVerifyUserDto } from "apps/account/src/dto/verify-email.account.dto";
import { v4 as uuidv4 } from 'uuid';
import { MEMBER_MESSAGE_PATTERNS } from "apps/member/src/constant/member-patterns.constants";
import { RefreshTokenAccountDto } from "apps/account/src/dto/refresh-token.account.dto";
import { WelcomeMailerDto } from "apps/mailer/src/dto/welcome.mailer.dto";
import { MAILER_MESSAGE_PATTERNS } from "apps/mailer/src/constant/mailer-patterns.constants";

@ApiTags('Mailer Gateway')
@Controller({
  path: '/mailer'
})

export class MailerGatewayController {

  constructor( 
    @Inject(RabbitServiceName.EMAIL) private mailerClient: ClientProxy,
    ) { }

  @Post('/welcomeMail')
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
