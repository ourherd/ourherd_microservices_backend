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




}
