import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Get, Inject, Logger, Param, ParseUUIDPipe, Post } from "@nestjs/common";
import { MEMBER_MESSAGE_PATTERNS, MEMBER_SERVICE } from "../../../../member/src/constant/member-patterns.constants";
import { IServiceResponse, RabbitServiceName } from "@app/rabbit";
import { ClientProxy } from "@nestjs/microservices";
import { IGatewayResponse } from "../../common/interface/gateway.interface";
import { VerifyUserDto } from "../../../../member/src/dto/verify-email.member.dto";
import { firstValueFrom } from "rxjs";
import { EmailVerifyTokenDto } from "../../../../member/src/dto/email-verify-token.account.dto";
import { SendMailerDto } from "../../../../mailer/src/dto/send.mailer.dto";
import { MAILER_MESSAGE_PATTERNS } from "../../../../mailer/src/constant/mailer-patterns.constants";

@ApiTags('Member Email Gateway')
@Controller({
  path: '/member/verification'
})

export class MemberVerificationGatewayController {
  logger = new Logger(MEMBER_SERVICE);

  constructor(
    @Inject(RabbitServiceName.MEMBER) private memberClient: ClientProxy,
    @Inject(RabbitServiceName.EMAIL) private emailClient: ClientProxy
  ) { }

  @Get('/verify/:token')
  @ApiOperation({ summary: 'Verify Token' })
  @ApiResponse({ status: 200, description: "user verify pass & token isn't expired" })
  async verify(
    @Param('token', ParseUUIDPipe) token: string
  ): Promise<IGatewayResponse> {
    let verifyUserDto = new VerifyUserDto()

    const response = await firstValueFrom(
      this.memberClient.send<IServiceResponse<any>, { verifyUserDto: VerifyUserDto }>
      (
        MEMBER_MESSAGE_PATTERNS.VERIFY_ACCOUNT,
        {
          verifyUserDto
        }
      )
    );
    return response;

  }

  @Post('/resend-verification')
  @ApiOperation({ summary: 'Resend verification code' })
  @ApiResponse({ status: 200, description: "generate new token and resend email with verify link again" })
  async sendEmailVerification(
    @Body() emailVerifyTokenDto: EmailVerifyTokenDto
  ): Promise<IGatewayResponse> {
    const sendMailerDtoResult = await firstValueFrom(
      this.memberClient.send<IServiceResponse<SendMailerDto>, { emailVerifyTokenDto: EmailVerifyTokenDto }>
      (
        MEMBER_MESSAGE_PATTERNS.RESEND_VERIFY,
        {
          emailVerifyTokenDto
        }
      )
    );

    if (sendMailerDtoResult.state === false) {
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

}
