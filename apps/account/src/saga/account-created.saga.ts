import { Inject, Injectable, Logger } from "@nestjs/common";
import { RegisterAccountDto } from "../dto/register.account.dto";
import { AccountService } from "../services/account.service";
import { IServiceResponse, RabbitServiceName } from "@app/rabbit";
import { AccountEntity } from "../entity/account.entity";
import { ClientProxy } from "@nestjs/microservices";
import { SendMailerDto } from "../../../mailer/src/dto/send.mailer.dto";
import { MemberEntity } from "../../../member/src/entity/member.entity";
import { MEMBER_MESSAGE_PATTERNS } from "../../../member/src/constant/member-patterns.constants";
import { firstValueFrom } from "rxjs";
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
   * This method will create an account in Cognito using register service, then member and send a welcome email
   * @param registerDto
   * @return AccountEntity
   */
  public async accountCreated ( registerDto: RegisterAccountDto ): Promise<IServiceResponse<AccountEntity>> {
    const account = await this.accountService.register(registerDto);
    if ( account !== null ){
      this.memberCreated(registerDto, account.data.id);
      //this.welcomeEmailSent(registerDto);
    }

    return account;
  }

  private memberCreated ( registerDto: RegisterAccountDto, id: string ) {
    let createDto = new CreateMemberDto();
    createDto.id = id;
    createDto.email = registerDto.email;
    createDto.password = registerDto.password;

    registerDto.id = id;
    this.memberClient.emit<IServiceResponse<MemberEntity>, { registerDto: RegisterAccountDto }>(
      MEMBER_MESSAGE_PATTERNS.EMIT_NEW_MEMBER,
      {
        registerDto
      }
    )
  }

  // Welcome email with a token
  private welcomeEmailSent ( registerDto: RegisterAccountDto ) {

    let email = registerDto.email;
    this.emailClient.emit<IServiceResponse<String>, { email: string }>(
      MAILER_MESSAGE_PATTERNS.EMIT_WELCOME_EMAIL,
      {
        email
      }
    );

  }
}
