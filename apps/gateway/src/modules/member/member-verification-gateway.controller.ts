import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Get, Inject, Logger, Param, ParseUUIDPipe, Post } from "@nestjs/common";
import { MEMBER_MESSAGE_PATTERNS, MEMBER_SERVICE } from "../../../../member/src/constant/member-patterns.constants";
import { IServiceResponse, RabbitServiceName } from "@app/rabbit";
import { ClientProxy } from "@nestjs/microservices";
import { IGatewayResponse } from "../../common/interface/gateway.interface";
import { VerifyEmailMemberDto } from "../../../../member/src/dto/verify-email.member.dto";
import { firstValueFrom } from "rxjs";
import { EmailVerifyTokenDto } from "../../../../member/src/dto/email-verify-token.account.dto";
import { SendMailerDto } from "../../../../mailer/src/dto/send.mailer.dto";
import { MAILER_MESSAGE_PATTERNS } from "../../../../mailer/src/constant/mailer-patterns.constants";
import { Auth, CurrentMember } from "@app/authentication";

@ApiTags('Member Verification Gateway')
@Controller({
  path: '/member/verification'
})

export class MemberVerificationGatewayController {
  logger = new Logger(MEMBER_SERVICE);

  constructor(
    @Inject(RabbitServiceName.MEMBER) private memberClient: ClientProxy,
    @Inject(RabbitServiceName.MAILER) private mailerClient: ClientProxy
  ) { }

  @Get('/verify/:token')
  @ApiOperation({ summary: 'Verify Token' })
  @ApiResponse({ status: 200, description: "Member verify pass & token isn't expired" })
  async verify(
    @Param('token', ParseUUIDPipe) token: string
  ): Promise<IGatewayResponse> {
    const verifyDto = new VerifyEmailMemberDto();
    const response = await firstValueFrom(
      this.memberClient.send<IServiceResponse<any>, { verifyDto: VerifyEmailMemberDto }>
      (
        MEMBER_MESSAGE_PATTERNS.VERIFY_ACCOUNT,
        {
          verifyDto
        }
      )
    );
    return response;

  }

  @Post('/request')
  @Auth()
  @ApiOperation({ summary: 'Verification code' })
  @ApiResponse({ status: 200, description: "Generate new token and resend email with verify link again" })
  async sendEmailVerification(
    @CurrentMember ('member_id') member_id: string,
    @Body() emailVerifyDto: EmailVerifyTokenDto
  ): Promise<IGatewayResponse> {

    emailVerifyDto.member_id = member_id;
    const verifyMemberEmail = await firstValueFrom(
      this.memberClient.send<IServiceResponse<SendMailerDto>, { emailVerifyDto: EmailVerifyTokenDto }>
      (
        MEMBER_MESSAGE_PATTERNS.SEND_VERIFY,
        {
          emailVerifyDto
        }
      )
    );
    return verifyMemberEmail;
  }

}
