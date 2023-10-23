import { Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ACCOUNT_MESSAGE_PATTERNS } from './constant/account-patterns.constants';
import { CreateAccountDto } from "./dto/register.account.dto";
import { IServiceResponse } from "@app/rabbit";
import { AccountEntity } from "./entity/account.entity";
import { LoginAccountDto } from './dto/login.account.dto';
import { TokenAccountDto } from './dto/token.account.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthChangePasswordUserDto } from './dto/change-password.account.dto';
import { AuthForgotPasswordUserDto } from './dto/reset-forget-password.dto';
import { AuthConfirmPasswordUserDto } from './dto/reset-confirm-password.dto';
import { AuthVerifyUserDto } from './dto/verify-email.account.dto';
import { CognitoService } from '@libs/cognito';

@Controller()
export class AccountController {
  @Inject(CognitoService)
  private awsCognitoService: CognitoService

  constructor(
    private readonly accountService: AccountService,
    
    ) {}

  @MessagePattern(ACCOUNT_MESSAGE_PATTERNS.CREATE)
  async register(
    @Payload('createDto') createDto: CreateAccountDto): Promise<IServiceResponse<AccountEntity>> {
    // change the signature to await
    return this.accountService.create(createDto);
  }
  
  @MessagePattern(ACCOUNT_MESSAGE_PATTERNS.VERIFY)
  async verifyEmail(
    @Payload('authVerifyUserDto') authVerifyUserDto: AuthVerifyUserDto): Promise<IServiceResponse<any>> {
    // change the signature to await
    let result = await this.awsCognitoService.verifyUser(authVerifyUserDto)
      return {
        state: true,
        data: result
      }
  }
  
  @MessagePattern(ACCOUNT_MESSAGE_PATTERNS.LOGIN)
  async login(
    @Payload('loginDto') loginDto: LoginAccountDto): Promise<IServiceResponse<TokenAccountDto>> {
    // change the signature to await
    return this.accountService.login(loginDto);
  }
  
  @MessagePattern(ACCOUNT_MESSAGE_PATTERNS.UPDATE_PASSWORD)
  async changePassword(
    @Payload('authChangePasswordUserDto') authChangePasswordUserDto: AuthChangePasswordUserDto): Promise<IServiceResponse<String>> {
      let result = await this.awsCognitoService.changeUserPassword(authChangePasswordUserDto)
      return {
        state: true,
        data: String(result)
      }
  }
  
  @MessagePattern(ACCOUNT_MESSAGE_PATTERNS.REQUEST_RESET_PASSWORD)
  async requestResetPassword(
    @Payload('authForgotPasswordUserDto') authForgotPasswordUserDto: AuthForgotPasswordUserDto): Promise<IServiceResponse<any>> {
      let result = await this.awsCognitoService.forgotUserPassword(authForgotPasswordUserDto)
      return {
        state: true,
        data: result
      }
  }
  
  @MessagePattern(ACCOUNT_MESSAGE_PATTERNS.RESET_PASSWORD)
  async resetPassword(
    @Payload('authConfirmPasswordUserDto') authConfirmPasswordUserDto: AuthConfirmPasswordUserDto): Promise<IServiceResponse<any>> {
      let result = await this.awsCognitoService.confirmUserPassword(authConfirmPasswordUserDto)
      return {
        state: true,
        data: result
      }
  }
  
  @UseGuards(AuthGuard('jwt'))
  async getHello(): Promise<string> {
    // change the signature to await
    return "Hello World!"
  }

}
