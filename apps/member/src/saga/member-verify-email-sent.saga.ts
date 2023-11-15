import { Inject, Injectable } from "@nestjs/common";
import { MemberVerificationService } from "../service/member.verification.service";
import { IServiceResponse, RabbitServiceName } from "@app/rabbit";
import { ClientProxy } from "@nestjs/microservices";
import { MemberVerificationEntity } from "../entity/member-verification.entity";
import { EmailVerifyTokenDto } from "../dto/email-verify-token.account.dto";
import { firstValueFrom } from "rxjs";
import { MemberEntity } from "../entity/member.entity";
import { MAILER_EVENT_PATTERNS } from "../../../mailer/src/constant/mailer-patterns.constants";

@Injectable()
export class MemberVerifyEmailSentSaga {

  constructor(
    @Inject(MemberVerificationService) private readonly verificationService: MemberVerificationService,
    @Inject(RabbitServiceName.MAILER) private emailClient: ClientProxy
) { }

  public async createToken ( verifyTokenDto: EmailVerifyTokenDto )
    : Promise<IServiceResponse<MemberVerificationEntity>> {
    const verification = await this.verificationService.memberVerificationToken( verifyTokenDto );
    await this.sentVerificationEmail( verifyTokenDto );
    return verification;
  }

  private async sentVerificationEmail( verifyTokenDto: EmailVerifyTokenDto ) {

    await firstValueFrom(
      this.emailClient.emit<IServiceResponse<MemberEntity>, { verifyTokenDto: EmailVerifyTokenDto }>(
        MAILER_EVENT_PATTERNS.EMIT_VERIFICATION_EMAIL,
        {
          verifyTokenDto
        }
      )
    );
  }

}
