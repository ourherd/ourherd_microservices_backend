import { Body, Controller, Inject, Post } from "@nestjs/common";
import { IGatewayResponse } from '../../common/interface/gateway.interface';
import { IServiceResponse, RabbitServiceName } from "@app/rabbit";
import { AccountEntity } from 'apps/account/src/entity/account.entity';
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

@ApiTags('Account Gateway')
@Controller({
  path: '/account'
})

export class AccountGatewayController {

  constructor(
    @Inject(RabbitServiceName.ACCOUNT) private accountClient: ClientProxy,
    @Inject(RabbitServiceName.MEMBER) private memberClient: ClientProxy
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

    let memberEntity = resultMember.data

    let resultAccount = await firstValueFrom(
      this.accountClient.send<IServiceResponse<AccountEntity>, { createDto: RegisterAccountDto, memberEntity: MemberEntity }>
        (
          ACCOUNT_MESSAGE_PATTERNS.REGISTER,
          {
            createDto,
            memberEntity
          }
        )
    );
    return resultAccount;
  }

  @Post('/verify')
  async verify(
    @Body() authVerifyUserDto: AuthVerifyUserDto
  ): Promise<IGatewayResponse> {
    const { state, data } = await firstValueFrom(
      this.accountClient.send<IServiceResponse<any>, { authVerifyUserDto: AuthVerifyUserDto }>
        (
          ACCOUNT_MESSAGE_PATTERNS.VERIFY,
          {
            authVerifyUserDto
          }
        )
    );
    return { state, data };
  }

  @Post('/login')
  async login(
    @Body() loginDto: LoginAccountDto
  ): Promise<IGatewayResponse> {
    const { state, data } = await firstValueFrom(
      this.accountClient.send<IServiceResponse<any>, { loginDto: LoginAccountDto }>
        (
          ACCOUNT_MESSAGE_PATTERNS.LOGIN,
          {
            loginDto
          }
        )
    );
    return { state, data };
  }

  @Post('/refresh')
  async refreshToken(
    @Body() refreshTokenAccountDto: RefreshTokenAccountDto
  ): Promise<IGatewayResponse> {
    const { state, data } = await firstValueFrom(
      this.accountClient.send<IServiceResponse<any>, { refreshTokenAccountDto: RefreshTokenAccountDto }>
        (
          ACCOUNT_MESSAGE_PATTERNS.REFRESH_TOKEN,
          {
            refreshTokenAccountDto
          }
        )
    );
    return { state, data };
  }

}
