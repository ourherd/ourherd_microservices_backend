import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterAccountDto } from "./dto/register.account.dto";
import { IServiceResponse, RabbitServiceName } from "@app/rabbit";
import { AccountEntity } from './entity/account.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Database } from '@app/database';
import { ACCOUNT_MESSAGE_DB_RESPONSE } from './constant/account-patterns.constants';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { MemberEntity } from 'apps/member/src/entity/member.entity';
import { CreateMemberDto } from 'apps/member/src/dto/create-member.dto';
import { MEMBER_MESSAGE_PATTERNS } from 'apps/member/src/constant/member-patterns.constants';
import { LoginAccountDto } from './dto/login.account.dto';
import { CognitoService } from '@libs/cognito';

@Injectable()
export class AccountService {

  @Inject(CognitoService)
  private awsCognitoService: CognitoService

  constructor(
    @InjectRepository(AccountEntity, Database.PRIMARY)
    private accountRepository: Repository<AccountEntity>,
    @Inject(RabbitServiceName.MEMBER)
    private memberService: ClientProxy
  ) {

  }
  

  async create(createAccoutDto: RegisterAccountDto): Promise<IServiceResponse<AccountEntity>> {
    const saltRounds = 10

    const accountExist = await this.findByEmail(createAccoutDto.email);

    if (accountExist.state) {
      return {
        state: accountExist.state,
        data: accountExist.data,
        message: ACCOUNT_MESSAGE_DB_RESPONSE.EMAIL_FOUND
      };
    }

    const createDto = new CreateMemberDto();
    
    createDto.email = createAccoutDto.email
    const { state, data } = await firstValueFrom(
      this.memberService.send<IServiceResponse<MemberEntity>, { createDto: CreateMemberDto }>
      (
        MEMBER_MESSAGE_PATTERNS.CREATE,
        {
          createDto
        }
      )
    );
    
    createAccoutDto.member_id = data.id

    let accountInit =  new RegisterAccountDto();
    const accountEntity = this.accountRepository.create(accountInit);

    const saltOrRounds = 10;
    // TODO: move to dto
    const hash = await bcrypt.hash(createAccoutDto.password, saltOrRounds);
    accountEntity.password_hash = hash
    accountEntity.member_id = createAccoutDto.member_id
    accountEntity.email = createAccoutDto.email

    const cognito_user = await this.awsCognitoService.registerUser(createAccoutDto)
      
    const result = await this.accountRepository.save(accountEntity);

    return {
      state: !!result,
      data: result,
      message: ACCOUNT_MESSAGE_DB_RESPONSE.CREATED
    };
  }

  async findByEmail(email: string): Promise<IServiceResponse<AccountEntity>> {
    const account = await this.accountRepository.findOneBy(
      {
        email: email
      }
    );

    return {
      state: !!account,
      data: account,
      message: !!account ? ACCOUNT_MESSAGE_DB_RESPONSE.EMAIL_FOUND : ACCOUNT_MESSAGE_DB_RESPONSE.EMAIL_NOT_FOUND
    }
  }

  async login(loginAccountDto: LoginAccountDto): Promise<IServiceResponse<any>> {

    try{
      const cognitoToken = await this.awsCognitoService.authenticateUser(loginAccountDto)
      
      return {
        state: true,
        data: cognitoToken,
        message: ACCOUNT_MESSAGE_DB_RESPONSE.EMAIL_FOUND
      };
    }catch(e) {
      console.log(e)
      return {
        state: true,
        data: null,
        message: ACCOUNT_MESSAGE_DB_RESPONSE.NOT_FOUND
      };
    }
    
  }

}
