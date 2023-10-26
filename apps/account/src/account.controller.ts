import { Controller, Inject, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ACCOUNT_MESSAGE_PATTERNS } from './constant/account-patterns.constants';
import { RegisterAccountDto } from "./dto/register.account.dto";
import { IServiceResponse } from "@app/rabbit";
import { AccountEntity } from "./entity/account.entity";
import { LoginAccountDto } from './dto/login.account.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthChangePasswordUserDto } from './dto/change-password.account.dto';
import { AuthForgotPasswordUserDto } from './dto/reset-forget-password.dto';
import { AuthConfirmPasswordUserDto } from './dto/reset-confirm-password.dto';
import { AuthVerifyUserDto } from './dto/verify-email.account.dto';
import { CognitoService } from '@libs/cognito';

import { UpdateResult } from 'typeorm';
import { RefreshTokenAccountDto } from './dto/refresh-token.account.dto';

@Controller()
export class AccountController {
  @Inject(CognitoService)
  private awsCognitoService: CognitoService

  constructor(
    private readonly accountService: AccountService,

  ) { }

  @MessagePattern(ACCOUNT_MESSAGE_PATTERNS.REGISTER)
  async register(
    @Payload('createDto') registerAccountDto: RegisterAccountDto): Promise<IServiceResponse<AccountEntity>> {
    return this.accountService.register(registerAccountDto);
  }

  @MessagePattern(ACCOUNT_MESSAGE_PATTERNS.VERIFY)
  async verifyEmail(
    @Payload('authVerifyUserDto') authVerifyUserDto: AuthVerifyUserDto): Promise<IServiceResponse<any>> {
    return this.accountService.verifyEmail(authVerifyUserDto)
  }

  @MessagePattern(ACCOUNT_MESSAGE_PATTERNS.LOGIN)
  async login(
    @Payload('loginDto') loginDto: LoginAccountDto): Promise<IServiceResponse<any>> {
    return this.accountService.login(loginDto);
  }
  // TODO CALL  ACCOUNT_MESSAGE_PATTERNS refresh ACCOUNT_MESSAGE_PATTERNS.REFRESH_TOKEN
  @MessagePattern(ACCOUNT_MESSAGE_PATTERNS.REFRESH)
  async refreshToken(
    @Payload('refreshTokenAccountDto') refreshTokenAccountDto: RefreshTokenAccountDto): Promise<IServiceResponse<any>> {
    return this.accountService.refreshToken(refreshTokenAccountDto);
  }

  @MessagePattern(ACCOUNT_MESSAGE_PATTERNS.UPDATE_PASSWORD)
  async changePassword(
    @Payload('authChangePasswordUserDto') authChangePasswordUserDto: AuthChangePasswordUserDto): Promise<IServiceResponse<UpdateResult>> {
    return this.accountService.changePassword(authChangePasswordUserDto)
  }

  @MessagePattern(ACCOUNT_MESSAGE_PATTERNS.REQUEST_RESET_PASSWORD)
  async requestResetPassword(
    @Payload('authForgotPasswordUserDto') authForgotPasswordUserDto: AuthForgotPasswordUserDto): Promise<IServiceResponse<any>> {
    let result = await this.awsCognitoService.forgotUserPassword(
      authForgotPasswordUserDto.email
    )
    return {
      state: true,
      data: result
    }
  }

  @MessagePattern(ACCOUNT_MESSAGE_PATTERNS.RESET_PASSWORD)
  async resetPassword(
    @Payload('authConfirmPasswordUserDto') authConfirmPasswordUserDto: AuthChangePasswordUserDto): Promise<IServiceResponse<any>> {
    return this.accountService.resetPassword(authConfirmPasswordUserDto);
  }


}
