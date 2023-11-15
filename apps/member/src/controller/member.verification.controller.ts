import { Controller } from "@nestjs/common";
import { MemberVerifyEmailSentSaga } from "../saga/member-verify-email-sent.saga";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { MEMBER_MESSAGE_PATTERNS } from "../constant/member-patterns.constants";
import { IServiceResponse } from "@app/rabbit";

import { EmailVerifyTokenDto } from "../dto/email-verify-token.account.dto";
import { MemberVerificationEntity } from "../entity/member-verification.entity";

@Controller()
export class MemberVerificationController {

  constructor(private readonly sagaEmail: MemberVerifyEmailSentSaga) {}

  @MessagePattern(MEMBER_MESSAGE_PATTERNS.SEND_VERIFY)
  async sendEmailVerification(
    @Payload('emailVerifyDto') emailVerifyDto: EmailVerifyTokenDto):
    Promise<IServiceResponse<MemberVerificationEntity>> {
    return this.sagaEmail.createToken(emailVerifyDto);
  }

}
