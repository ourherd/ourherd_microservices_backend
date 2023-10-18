import { Body, Controller, Get, Inject, Post, Query } from "@nestjs/common";
import { IGatewayResponse } from '../../common/interface/gateway.interface';
import { IServiceResponse, RabbitServiceName } from "@app/rabbit";
import { IPagination, PaginationDto } from '@app/common';
import { AccountEntity } from 'apps/account/src/entity/account.entity';
import { CreateAccountDto } from "apps/account/src/dto/register.account.dto";
import { Auth, CurrentUser } from "@app/authentication";
import { ApiTags } from "@nestjs/swagger";
import { firstValueFrom } from "rxjs";
import { ACCOUNT_MESSAGE_PATTERNS } from "../../../../account/src/constant/account-patterns.constants";
import { ClientProxy } from "@nestjs/microservices";

@ApiTags('Account Gateway')
@Controller({
  path: '/account'
})

export class AccountGatewayController {

  constructor( @Inject(RabbitServiceName.ACCOUNT) private accountClient: ClientProxy) { }

  @Post('/register')
  async register ( @Query() createDto: CreateAccountDto ): Promise<IGatewayResponse<AccountEntity>> {
    const { state, data } = await firstValueFrom(
      this.accountClient.send<IServiceResponse<AccountEntity>>
      (
        ACCOUNT_MESSAGE_PATTERNS.CREATE,
        createDto
      )
    );
    return { state, data };
  }




}
