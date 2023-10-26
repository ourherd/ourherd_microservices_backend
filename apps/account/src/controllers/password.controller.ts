import { Controller, Inject } from '@nestjs/common';
import { AccountService } from '../services/account.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ACCOUNT_MESSAGE_PATTERNS } from '../constant/account-patterns.constants';
import { IServiceResponse } from "@app/rabbit";
import { AuthChangePasswordUserDto } from '../dto/change-password.account.dto';
import { AuthForgotPasswordUserDto } from '../dto/reset-forget-password.dto';
import { CognitoService } from '@libs/cognito';

import { UpdateResult } from 'typeorm';
import { PasswordService } from '../services/password.service';

@Controller()
export class PasswordController {
  @Inject(CognitoService)
  private awsCognitoService: CognitoService

  constructor(
    private readonly passwordService: PasswordService,
  ) { }

  @MessagePattern(ACCOUNT_MESSAGE_PATTERNS.UPDATE_PASSWORD)
  async changePassword(
    @Payload('authChangePasswordUserDto') authChangePasswordUserDto: AuthChangePasswordUserDto): Promise<IServiceResponse<UpdateResult>> {
    return this.passwordService.changePassword(authChangePasswordUserDto)
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
    return this.passwordService.resetPassword(authConfirmPasswordUserDto);
  }


}
