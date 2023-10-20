import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from "./dto/register.account.dto";
import { IServiceResponse } from "@app/rabbit";
import { AccountEntity } from './entity/account.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Database } from '@app/database';
import { has } from 'lodash';
import { ACCOUNT_MESSAGE_DB_RESPONSE } from './constant/account-patterns.constants';

@Injectable()
export class AccountService {

  constructor(
    @InjectRepository(AccountEntity, Database.PRIMARY)
    private accountRepository: Repository<AccountEntity>,
  ) {

  }

  async create(createDto: CreateAccountDto): Promise<IServiceResponse<AccountEntity>> {
    const bcrypt = require("bcrypt")
    const saltRounds = 10

    // AccountEntity acc = new AccountEntity();

    let email = createDto.email

    const accountExist = await this.accountRepository.findOneBy({email});

    if (!!accountExist) {
      return {
        state: !!accountExist,
        data: accountExist,
        message: ACCOUNT_MESSAGE_DB_RESPONSE.EMAIL_FOUND
      };
    }

    bcrypt
      .genSalt(saltRounds)
      .then(salt => {
        console.log('Salt: ', salt)
        return bcrypt.hash(createDto.password, salt)
      })
      .then(hash => {
        createDto.password = hash
      })
      .catch(err => console.error(err.message))

    const result = this.accountRepository.create(createDto);

    return {
      state: true,
      data: result,
      message: 'memberExist.message'
    };
  }

}
