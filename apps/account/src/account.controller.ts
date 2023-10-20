import { Controller, Post } from '@nestjs/common';
import { AccountService } from './account.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ACCOUNT_MESSAGE_PATTERNS } from './constant/account-patterns.constants';
import { CreateAccountDto } from "./dto/register.account.dto";
import { IServiceResponse } from "@app/rabbit";
import { AccountEntity } from "./entity/account.entity";

@Controller()
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @MessagePattern(ACCOUNT_MESSAGE_PATTERNS.CREATE)
  async register(
    @Payload('createDto') createDto: CreateAccountDto): Promise<IServiceResponse<AccountEntity>> {
    // change the signature to await
    return this.accountService.create(createDto);
  }
  
  async getHello(): Promise<string> {
    // change the signature to await
    return "Hello World!"
  }

  

}
