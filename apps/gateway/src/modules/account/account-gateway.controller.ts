import { Body, Controller, Get, Inject, Logger, Param, Post } from "@nestjs/common";
import { IGatewayResponse } from '../../common/interface/gateway.interface';
import { IServiceResponse, RabbitServiceName } from "@app/rabbit";
import { RegisterAccountDto } from "apps/account/src/dto/register.account.dto";
import { ApiTags } from "@nestjs/swagger";
import { firstValueFrom } from "rxjs";
import { ACCOUNT_MESSAGE_PATTERNS } from "../../../../account/src/constant/account-patterns.constants";
import { ClientProxy } from "@nestjs/microservices";
import { LoginAccountDto } from "apps/account/src/dto/login.account.dto";
import { AuthVerifyUserDto } from "apps/account/src/dto/verify-email.account.dto";
import { MEMBER_MESSAGE_PATTERNS } from "apps/member/src/constant/member-patterns.constants";
import { RefreshTokenAccountDto } from "apps/account/src/dto/refresh-token.account.dto";
import { MemberEntity } from "apps/member/src/entity/member.entity";
import { MAILER_MESSAGE_PATTERNS } from "apps/mailer/src/constant/mailer-patterns.constants";
import { SendMailerDto } from "apps/mailer/src/dto/send.mailer.dto";
import { EmailVerifyTokenDto } from "apps/account/src/dto/email-verify-token.account.dto";
import { GATEWAY_SERVICE } from "../../constant/gateway-patterns.constants";

@ApiTags('Account Gateway')
@Controller({
  path: '/account'
})

export class AccountGatewayController {
  private logger = new Logger(GATEWAY_SERVICE);

  constructor(
    @Inject(RabbitServiceName.ACCOUNT) private accountClient: ClientProxy,
    @Inject(RabbitServiceName.MEMBER) private memberClient: ClientProxy,
    @Inject(RabbitServiceName.EMAIL) private emailClient: ClientProxy
  ) { }

  @Post('/register')
  async register(
    @Body() createDto: RegisterAccountDto
  ): Promise<IGatewayResponse> {

    const resultMember = await firstValueFrom(
      this.memberClient.send<IServiceResponse<MemberEntity>, { createDto: RegisterAccountDto }>
        (
          MEMBER_MESSAGE_PATTERNS.CREATE,
          {
            createDto
          }
        )
    );

    if (resultMember.state == false) {
      return resultMember;
    }

    // follow the concept of relational entity field
    // https://github.com/typeorm/typeorm/blob/master/docs/one-to-one-relations.md
    createDto.member = resultMember.data

    let sendMailerDtoResult = await firstValueFrom(
      this.accountClient.send<IServiceResponse<SendMailerDto>, { createDto: RegisterAccountDto }>
        (
          ACCOUNT_MESSAGE_PATTERNS.REGISTER,
          {
            createDto
          }
        )
    );

    if (sendMailerDtoResult.state == false) {
      return sendMailerDtoResult;
    }

    let sendMailerDtoData = sendMailerDtoResult.data

    let resultSendMail = await firstValueFrom(
      this.emailClient.send<IServiceResponse<String>, { sendMailerDtoData: SendMailerDto }>
        (
          MAILER_MESSAGE_PATTERNS.EMAIL_SENT,
          {
            sendMailerDtoData
          }
        )
    );

    return resultSendMail;
  }

  @Get('/verify/:token')
  async verify(
    @Param('token') token
  ): Promise<IGatewayResponse> {
    let authVerifyUserDto = new AuthVerifyUserDto()
    authVerifyUserDto.confirmationCode = token
    const response = await firstValueFrom(
      this.accountClient.send<IServiceResponse<any>, { authVerifyUserDto: AuthVerifyUserDto }>
        (
          ACCOUNT_MESSAGE_PATTERNS.VERIFY_ACCOUNT,
          {
            authVerifyUserDto
          }
        )
    );
    return response;

  }

  @Post('/resend-verification')
  async sendEmailVerification(
    @Body() emailVerifyTokenDto: EmailVerifyTokenDto
  ): Promise<IGatewayResponse> {
    const sendMailerDtoResult = await firstValueFrom(
      this.accountClient.send<IServiceResponse<SendMailerDto>, { emailVerifyTokenDto: EmailVerifyTokenDto }>
        (
          ACCOUNT_MESSAGE_PATTERNS.RESEND_VERIFY,
          {
            emailVerifyTokenDto
          }
        )
    );

    if (sendMailerDtoResult.state == false) {
      return sendMailerDtoResult;
    }

    let sendMailerDtoData = sendMailerDtoResult.data

    let resultSendMail = await firstValueFrom(
      this.emailClient.send<IServiceResponse<String>, { sendMailerDtoData: SendMailerDto }>
        (
          MAILER_MESSAGE_PATTERNS.EMAIL_SENT,
          {
            sendMailerDtoData
          }
        )
    );
    return resultSendMail;
  }

  @Post('/login')
  async login(
    @Body() loginDto: LoginAccountDto
  ): Promise<IGatewayResponse> {
    const response = await firstValueFrom(
      this.accountClient.send<IServiceResponse<any>, { loginDto: LoginAccountDto }>
        (
          ACCOUNT_MESSAGE_PATTERNS.LOGIN,
          {
            loginDto
          }
        )
    );
    return response;
  }

  @Post('/refresh')
  async refreshToken(
    @Body() refreshTokenAccountDto: RefreshTokenAccountDto
  ): Promise<IGatewayResponse> {
    const response = await firstValueFrom(
      this.accountClient.send<IServiceResponse<any>, { refreshTokenAccountDto: RefreshTokenAccountDto }>
        (
          ACCOUNT_MESSAGE_PATTERNS.REFRESH_TOKEN,
          {
            refreshTokenAccountDto
          }
        )
    );
    return response;
  }

}
