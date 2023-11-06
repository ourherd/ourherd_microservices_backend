import { Controller } from '@nestjs/common';
import { AccountService } from '../services/account.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ACCOUNT_MESSAGE_PATTERNS } from '../constant/account-patterns.constants';
import { RegisterAccountDto } from "../dto/register.account.dto";
import { IServiceResponse } from "@app/rabbit";
import { LoginAccountDto } from '../dto/login.account.dto';
import { AuthVerifyUserDto } from '../dto/verify-email.account.dto';

import { UpdateResult } from 'typeorm';
import { RefreshTokenAccountDto } from '../dto/refresh-token.account.dto';
import { EmailVerifyTokenDto } from '../dto/email-verify-token.account.dto';
import { SendMailerDto } from 'apps/mailer/src/dto/send.mailer.dto';

@Controller()
export class AccountController {

  constructor(
    private readonly accountService: AccountService,
  ) { }

  @MessagePattern(ACCOUNT_MESSAGE_PATTERNS.REGISTER)
  async register(
    @Payload('createDto') registerAccountDto: RegisterAccountDto
  ): Promise<IServiceResponse<SendMailerDto>> {
    const accountCreateResult = this.accountService.register(registerAccountDto)
    const emailVerificationEntity = this.accountService.createEmailToken((await accountCreateResult).data.email);

    return emailVerificationEntity
  }

  @MessagePattern(ACCOUNT_MESSAGE_PATTERNS.VERIFY_ACCOUNT)
  async verifyEmail(
    @Payload('authVerifyUserDto') authVerifyUserDto: AuthVerifyUserDto): Promise<IServiceResponse<UpdateResult>> {
    return this.accountService.verifyEmail(authVerifyUserDto)
  }

  @MessagePattern(ACCOUNT_MESSAGE_PATTERNS.RESEND_VERIFY)
  async sendEmailVerification(
    @Payload('emailVerifyTokenDto') emailVerifyTokenDto: EmailVerifyTokenDto): Promise<IServiceResponse<SendMailerDto>> {
    return this.accountService.createEmailToken(emailVerifyTokenDto.email)
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
