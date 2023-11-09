import { Controller } from "@nestjs/common";
import { MemberMailService } from "../service/member.mail.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { MEMBER_MESSAGE_PATTERNS } from "../constant/member-patterns.constants";
import { VerifyUserDto } from "../dto/verify-email.member.dto";
import { IServiceResponse } from "@app/rabbit";
import { UpdateResult } from "typeorm";
import { EmailVerifyTokenDto } from "../dto/email-verify-token.account.dto";
import { SendMailerDto } from "../../../mailer/src/dto/send.mailer.dto";

@Controller()
export class MemberMailController {

  constructor(private readonly mailService: MemberMailService) {}

  @MessagePattern(MEMBER_MESSAGE_PATTERNS.VERIFY_ACCOUNT)
  async verifyEmail(
    @Payload('verifyUserDto') authVerifyUserDto: VerifyUserDto): Promise<IServiceResponse<UpdateResult>> {
    return this.mailService.verifyEmail(authVerifyUserDto)
  }

  @MessagePattern(MEMBER_MESSAGE_PATTERNS.RESEND_VERIFY)
  async sendEmailVerification(
    @Payload('emailVerifyTokenDto') emailVerifyTokenDto: EmailVerifyTokenDto): Promise<IServiceResponse<SendMailerDto>> {
    return this.mailService.sentEmailToken( emailVerifyTokenDto.email )
  }

}
