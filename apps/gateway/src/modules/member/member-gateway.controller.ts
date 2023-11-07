import { Body, Controller, Get, Inject, Logger, Param, ParseUUIDPipe, Patch, Post, Query } from "@nestjs/common";
import { IGatewayResponse } from "../../common/interface/gateway.interface";
import { IServiceResponse, RabbitServiceName } from "@app/rabbit";
import { IPagination } from "@app/common";
import { MemberEntity } from "apps/member/src/entity/member.entity";
import { FindMemberDto } from "apps/member/src/dto/find.member.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { firstValueFrom } from "rxjs";
import { MEMBER_MESSAGE_PATTERNS, MEMBER_SERVICE } from "../../../../member/src/constant/member-patterns.constants";
import { ClientProxy } from "@nestjs/microservices";
import { CreateMemberDto } from "../../../../member/src/dto/create-member.dto";
import { UpdateMemberDto } from "../../../../member/src/dto/update-member.dto";
import { EmailVerifyTokenDto } from "apps/member/src/dto/email-verify-token.account.dto";
import { SendMailerDto } from "apps/mailer/src/dto/send.mailer.dto";
import { MAILER_MESSAGE_PATTERNS } from "apps/mailer/src/constant/mailer-patterns.constants";
import { VerifyUserDto } from "apps/member/src/dto/verify-email.member.dto";

@ApiTags('Member Module')
@Controller({
  path: '/member'
})

export class MemberGatewayController {

  logger = new Logger(MEMBER_SERVICE);
  constructor(
    @Inject(RabbitServiceName.MEMBER) private memberClient: ClientProxy,
    @Inject(RabbitServiceName.EMAIL) private emailClient: ClientProxy
  ) { }

  @Get('/')
  async getMembers ( @Query() findDto: FindMemberDto ): Promise<IGatewayResponse<IPagination<MemberEntity>>> {
    const { state, data } = await firstValueFrom(
      this.memberClient.send<IServiceResponse<IPagination<MemberEntity>>>
      (
        MEMBER_MESSAGE_PATTERNS.FIND_ALL,
        findDto
      )
    );
    return { state, data };
  }

  @Post('/')
  async createProfile ( @Body() createDto: CreateMemberDto) : Promise<IGatewayResponse> {

    const { state, data } = await firstValueFrom(
      this.memberClient.send<IServiceResponse<MemberEntity>, { createDto: CreateMemberDto }>
      (
        MEMBER_MESSAGE_PATTERNS.CREATE,
        {
          createDto
        }
      )
    );
    return { state, data };
  };

  @Patch('/:id')
  async updateProfile(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateMemberDto
  ) : Promise<IGatewayResponse> {

    const { state, data } = await firstValueFrom(
      this.memberClient.send<IServiceResponse<MemberEntity>, { id: string, updateDto: UpdateMemberDto }>(
        MEMBER_MESSAGE_PATTERNS.UPDATE,
        {
          id,
          updateDto
        }
      )
    );

    return { state, data };
  }

  @Get('/verify/:token')
  @ApiOperation({ summary: 'Verify Token' })
  @ApiResponse({ status: 200, description: "user verify pass & token isn't expired" })
  async verify(
    @Param('token', ParseUUIDPipe) token: string
  ): Promise<IGatewayResponse> {
    let verifyUserDto = new VerifyUserDto()
    this.logger.log(verifyUserDto.confirmationCode)
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
