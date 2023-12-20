import { Controller, Logger } from "@nestjs/common";
import { MailerService } from "./mailer.service";
import { MAILER_EVENT_PATTERNS, MAILER_MESSAGE_PATTERNS, MAILER_SERVICE } from "./constant/mailer-patterns.constants";
import { EventPattern, Payload } from "@nestjs/microservices";
import { RegisterAccountDto } from "../../account/src/dto/register.account.dto";
import { EmailVerifyTokenDto } from "../../member/src/dto/email-verify-token.account.dto";
import { EmailEnum } from "./constant/template-map-constants";

@Controller()
export class MailerController {

  private logger = new Logger(MAILER_SERVICE);

  constructor(private readonly mailerService: MailerService) {}

  @EventPattern(MAILER_MESSAGE_PATTERNS.EMIT_WELCOME_EMAIL)
  async sentWelcomeEmail(
    @Payload('registerDto') registerDto: RegisterAccountDto ) {
    this.logger.log('Sent Welcome Email');
    await this.mailerService.sendWelcomeEmail( registerDto );
  }

  @EventPattern(MAILER_EVENT_PATTERNS.EMIT_VERIFICATION_EMAIL)
  async sentVerificationEmail(
    @Payload('verifyTokenDto') verifyTokenDto: EmailVerifyTokenDto) {
    this.logger.log('Sent Verification Email');
    await this.mailerService.sendEmailVerification( verifyTokenDto );
  }

  @EventPattern(MAILER_EVENT_PATTERNS.EMIT_MODERATION_EMAIL)
  async sentModerationMessageEmail(
    @Payload('email') email: string,
    @Payload('template') template: EmailEnum
    ) {
    this.logger.log('Sent Moderation Message Email');
    await this.mailerService.sendEmailModerationMessage( email, template );
  }

}
