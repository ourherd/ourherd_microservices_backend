import { Controller } from '@nestjs/common';
import { AccountService } from '../services/account.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ACCOUNT_MESSAGE_PATTERNS } from '../constant/account-patterns.constants';
import { RegisterAccountDto } from "../dto/register.account.dto";
import { IServiceResponse } from "@app/rabbit";
import { LoginAccountDto } from '../dto/login.account.dto';

import { RefreshTokenAccountDto } from '../dto/refresh-token.account.dto';
import { AccountEntity } from '../entity/account.entity';
import { AccountCreatedSaga } from "../saga/account-created.saga";

@Controller()
export class AccountController {

  constructor(
    private readonly accountService: AccountService,
    private readonly accountSaga: AccountCreatedSaga,
  ) { }

  @MessagePattern(ACCOUNT_MESSAGE_PATTERNS.REGISTER)
  async register(
    @Payload('createDto') registerAccountDto: RegisterAccountDto
  ): Promise<IServiceResponse<AccountEntity>> {
    return await this.accountSaga.accountCreated(registerAccountDto);
  }

  @MessagePattern(ACCOUNT_MESSAGE_PATTERNS.LOGIN)
  async login(
    @Payload('loginDto') loginDto: LoginAccountDto): Promise<IServiceResponse<AccountEntity>> {
    return await this.accountService.login(loginDto);
  }

  @MessagePattern(ACCOUNT_MESSAGE_PATTERNS.REFRESH_TOKEN)
  async refreshToken(
    @Payload('refreshTokenAccountDto') refreshTokenAccountDto: RefreshTokenAccountDto): Promise<IServiceResponse<any>> {
    return await this.accountService.refreshToken(refreshTokenAccountDto);
  }

}
