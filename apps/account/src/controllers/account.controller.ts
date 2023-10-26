import { Controller, Inject } from '@nestjs/common';
import { AccountService } from '../services/account.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ACCOUNT_MESSAGE_PATTERNS } from '../constant/account-patterns.constants';
import { RegisterAccountDto } from "../dto/register.account.dto";
import { IServiceResponse } from "@app/rabbit";
import { AccountEntity } from "../entity/account.entity";
import { LoginAccountDto } from '../dto/login.account.dto';
import { AuthChangePasswordUserDto } from '../dto/change-password.account.dto';
import { AuthForgotPasswordUserDto } from '../dto/reset-forget-password.dto';
import { AuthVerifyUserDto } from '../dto/verify-email.account.dto';
import { CognitoService } from '@libs/cognito';

import { UpdateResult } from 'typeorm';
import { RefreshTokenAccountDto } from '../dto/refresh-token.account.dto';
import { MemberEntity } from 'apps/member/src/entity/member.entity';
import { PasswordService } from '../services/password.service';

@Controller()
export class AccountController {

  constructor(
    private readonly accountService: AccountService,
  ) { }

  @MessagePattern(ACCOUNT_MESSAGE_PATTERNS.REGISTER)
  async register(
    @Payload('createDto') registerAccountDto: RegisterAccountDto,  
    @Payload('memberEntity') memberEntity: MemberEntity
  ): Promise<IServiceResponse<AccountEntity>> {
    return this.accountService.register(registerAccountDto, memberEntity);
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

  @MessagePattern(ACCOUNT_MESSAGE_PATTERNS.REFRESH_TOKEN)
  async refreshToken(
    @Payload('refreshTokenAccountDto') refreshTokenAccountDto: RefreshTokenAccountDto): Promise<IServiceResponse<any>> {
    return this.accountService.refreshToken(refreshTokenAccountDto);
  }

}
