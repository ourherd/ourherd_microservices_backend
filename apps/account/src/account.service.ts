import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from "./dto/register.account.dto";
import { IServiceResponse } from "@app/rabbit";
import { AccountEntity } from './entity/account.entity';

@Injectable()
export class AccountService {

  async create(createDto: CreateAccountDto): Promise<IServiceResponse<AccountEntity>>  {
      return {
        state: true,
        data: 's',
        message: 'memberExist.message'
      };
  }

}
