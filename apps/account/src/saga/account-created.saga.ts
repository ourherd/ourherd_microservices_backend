import { Inject, Injectable, Logger } from "@nestjs/common";
import { RegisterAccountDto } from "../dto/register.account.dto";
import { AccountService } from "../services/account.service";
import { IServiceResponse, RabbitServiceName } from "@app/rabbit";
import { AccountEntity } from "../entity/account.entity";
import { ClientProxy } from "@nestjs/microservices";
import { MemberEntity } from "../../../member/src/entity/member.entity";
import { firstValueFrom } from "rxjs";
import { MEMBER_EVENT_PATTERNS } from "../../../member/src/constant/member-patterns.constants";
import { MAILER_MESSAGE_PATTERNS } from "../../../mailer/src/constant/mailer-patterns.constants";
import { CreateMemberDto } from "../../../member/src/dto/create-member.dto";

@Injectable()
export class AccountCreatedSaga {

  private logger = new Logger(AccountCreatedSaga.name);

  constructor(
    private readonly accountService: AccountService,
    @Inject(RabbitServiceName.MEMBER) private memberClient: ClientProxy,
    @Inject(RabbitServiceName.MAILER) private emailClient: ClientProxy
  ) { }

  /**
   * @remarks This method will create an account in Cognito using register service, then member and send a welcome email
   * @param registerDto
   * @return AccountEntity
   */
  public async accountCreated ( registerDto: RegisterAccountDto ): Promise<IServiceResponse<AccountEntity>> {
    const account = await this.accountService.register(registerDto);
    registerDto.id = account.data.id;

    await this.memberCreated(registerDto);
    await this.welcomeEmailSent(registerDto);

    delete account.data.password;
    return account;
  }
  /**
   * @remarks Create member entity
   * @param {RegisterAccountDto}
   * @param {user id: id}
   * */
  private async memberCreated ( registerDto: RegisterAccountDto ) {
    let createDto: CreateMemberDto = new CreateMemberDto();
    createDto.id = registerDto.id;
    createDto.email = registerDto.email;
    createDto.birthday = registerDto.birthday;
    createDto.newsletter = registerDto.newsletter;

    await firstValueFrom(
        this.memberClient.emit<IServiceResponse<MemberEntity>, { token: string, createDto: CreateMemberDto }>(
        MEMBER_EVENT_PATTERNS.CREATED,
        {
          token : registerDto.token,
          createDto
        }
      )
    );
  }

  /**
   * @remarks send a welcome email
   * @param {RegisterAccountDto}
   * */
  private async welcomeEmailSent ( registerDto: RegisterAccountDto ) {

    await this.emailClient.emit<IServiceResponse<String>, { registerDto: RegisterAccountDto }>(
      MAILER_MESSAGE_PATTERNS.EMIT_WELCOME_EMAIL,
      {
        registerDto
      }
);
  }

  /**
   * @remarks Create token verification member
   * @param {RegisterAccountDto}
   * @param {user id: id}
   * */
  // private async memberVerificationCreated ( registerDto: RegisterAccountDto  ) {
  //
  //   let verifyMemberDto = new VerifyEmailMemberDto();
  //   verifyMemberDto.member_id = registerDto.id;
  //   verifyMemberDto.confirmationCode = registerDto.token;
  //   verifyMemberDto.email = registerDto.email;
  //
  //   await firstValueFrom(
  //     this.memberClient.emit<IServiceResponse<MemberEntity>, { verifyDto: VerifyEmailMemberDto }>(
  //       MEMBER_EVENT_PATTERNS.EMAIL_VERIFICATION_CREATED,
  //       {
  //         verifyDto: verifyMemberDto
  //       }
  //     )
  //   );
  // }

}
