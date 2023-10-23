import { Body, Controller, Inject, Post, Query } from "@nestjs/common";
import { IGatewayResponse } from '../../common/interface/gateway.interface';
import { IServiceResponse, RabbitServiceName } from "@app/rabbit";
import { AccountEntity } from 'apps/account/src/entity/account.entity';
import { CreateAccountDto } from "apps/account/src/dto/register.account.dto";
import { ApiTags } from "@nestjs/swagger";
import { firstValueFrom } from "rxjs";
import { ACCOUNT_MESSAGE_PATTERNS } from "../../../../account/src/constant/account-patterns.constants";
import { ClientProxy } from "@nestjs/microservices";
import { LoginAccountDto } from "apps/account/src/dto/login.account.dto";
import { TokenAccountDto } from "apps/account/src/dto/token.account.dto";
import { AuthChangePasswordUserDto } from "apps/account/src/dto/change-password.account.dto";
import { AuthForgotPasswordUserDto } from "apps/account/src/dto/reset-forget-password.dto";
import { AuthConfirmPasswordUserDto } from "apps/account/src/dto/reset-confirm-password.dto";
import { AuthVerifyUserDto } from "apps/account/src/dto/verify-email.account.dto";

@ApiTags('Account Gateway')
@Controller({
  path: '/account'
})

export class AccountGatewayController {

  constructor( @Inject(RabbitServiceName.ACCOUNT) private accountClient: ClientProxy) { }

  @Post('/register')
  async register ( 
    @Body() createDto: CreateAccountDto 
    ): Promise<IGatewayResponse> {
    const { state, data } = await firstValueFrom(
      this.accountClient.send<IServiceResponse<AccountEntity>, { createDto: CreateAccountDto}>
      (
        ACCOUNT_MESSAGE_PATTERNS.CREATE,
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
      this.accountClient.send<IServiceResponse<TokenAccountDto>, { loginDto: LoginAccountDto}>
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




}
