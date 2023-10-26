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
import { AuthChangePasswordUserDto } from "apps/account/src/dto/change-password.account.dto";
import { AuthForgotPasswordUserDto } from "apps/account/src/dto/reset-forget-password.dto";
import { AuthConfirmPasswordUserDto } from "apps/account/src/dto/reset-confirm-password.dto";
import { AuthVerifyUserDto } from "apps/account/src/dto/verify-email.account.dto";
import { v4 as uuidv4 } from 'uuid';
import { MEMBER_MESSAGE_PATTERNS } from "apps/member/src/constant/member-patterns.constants";
import { RefreshTokenAccountDto } from "apps/account/src/dto/refresh-token.account.dto";

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
  async register (
    @Body() createDto: RegisterAccountDto
    ): Promise<IGatewayResponse> {

      // TODO Change it later
      createDto.member_id = createDto.id;

      const { state, data } = await firstValueFrom(
        this.accountClient.send<IServiceResponse<AccountEntity>, { createDto: RegisterAccountDto}>
        (
          ACCOUNT_MESSAGE_PATTERNS.REGISTER,
          {
            createDto
          }
        )
      );
      await firstValueFrom(
        this.memberClient.send<IServiceResponse<AccountEntity>, { createDto: RegisterAccountDto}>
        (
          MEMBER_MESSAGE_PATTERNS.CREATE,
          {
            createDto
          }
        )
    );
    return { state, data };
  }

  @Post('/verify')
  async verify (
    @Body() authVerifyUserDto: AuthVerifyUserDto
    ): Promise<IGatewayResponse> {
    const { state, data } = await firstValueFrom(
      this.accountClient.send<IServiceResponse<any>, { authVerifyUserDto: AuthVerifyUserDto}>
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
  async login (
    @Body() loginDto: LoginAccountDto
    ): Promise<IGatewayResponse> {
    const { state, data } = await firstValueFrom(
      this.accountClient.send<IServiceResponse<any>, { loginDto: LoginAccountDto}>
      (
        ACCOUNT_MESSAGE_PATTERNS.LOGIN,
        {
          loginDto
        }
      )
    );
    return { state, data };
  }

  @Post('/change-password')
  async changePassword (
    @Body() authChangePasswordUserDto: AuthChangePasswordUserDto
    ): Promise<IGatewayResponse> {
    const { state, data } = await firstValueFrom(
      this.accountClient.send<IServiceResponse<String>, { authChangePasswordUserDto: AuthChangePasswordUserDto}>
      (
        ACCOUNT_MESSAGE_PATTERNS.UPDATE_PASSWORD,
        {
          authChangePasswordUserDto
        }
      )
    );
    return { state, data };
  }

  @Post('/forgot-password')
  async requestResetPassword (
    @Body() authForgotPasswordUserDto: AuthForgotPasswordUserDto
    ): Promise<IGatewayResponse> {
    const { state, data } = await firstValueFrom(
      this.accountClient.send<IServiceResponse<any>, { authForgotPasswordUserDto: AuthForgotPasswordUserDto}>
      (
        ACCOUNT_MESSAGE_PATTERNS.REQUEST_RESET_PASSWORD,
        {
          authForgotPasswordUserDto
        }
      )
    );
    return { state, data };
  }

  @Post('/confirm-password')
  async confirmResetPassword (
    @Body() authConfirmPasswordUserDto: AuthConfirmPasswordUserDto
    ): Promise<IGatewayResponse> {
    const { state, data } = await firstValueFrom(
      this.accountClient.send<IServiceResponse<any>, { authConfirmPasswordUserDto: AuthConfirmPasswordUserDto}>
      (
        ACCOUNT_MESSAGE_PATTERNS.RESET_PASSWORD,
        {
          authConfirmPasswordUserDto
        }
      )
    );
    return { state, data };
  }

  @Post('/refresh')
  async refreshToken (
    @Body() refreshTokenAccountDto: RefreshTokenAccountDto
    ): Promise<IGatewayResponse> {
    const { state, data } = await firstValueFrom(
      this.accountClient.send<IServiceResponse<any>, { refreshTokenAccountDto: RefreshTokenAccountDto}>
      (
        ACCOUNT_MESSAGE_PATTERNS.REFRESH,
        {
          refreshTokenAccountDto
        }
      )
    );
    return { state, data };
  }


}
