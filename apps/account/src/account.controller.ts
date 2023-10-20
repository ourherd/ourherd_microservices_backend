import { Controller, Post } from '@nestjs/common';
import { AccountService } from './account.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ACCOUNT_MESSAGE_PATTERNS } from './constant/account-patterns.constants';
import { CreateAccountDto } from "./dto/register.account.dto";
import { IServiceResponse } from "@app/rabbit";
import { AccountEntity } from "./entity/account.entity";
import { LoginAccountDto } from './dto/login.account.dto';
import { TokenAccountDto } from './dto/token.account.dto';

@Controller()
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @MessagePattern(ACCOUNT_MESSAGE_PATTERNS.CREATE)
  async register(
    @Payload('createDto') createDto: CreateAccountDto): Promise<IServiceResponse<AccountEntity>> {
    // change the signature to await
    return this.accountService.create(createDto);
  }
  
  @MessagePattern(ACCOUNT_MESSAGE_PATTERNS.LOGIN)
  async login(
    @Payload('loginDto') loginDto: LoginAccountDto): Promise<IServiceResponse<TokenAccountDto>> {
    // change the signature to await
    return this.accountService.login(loginDto);
  }
  
  async getHello(): Promise<string> {
    // change the signature to await
    return "Hello World!"
  }

  

}
