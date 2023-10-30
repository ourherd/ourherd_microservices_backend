import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterAccountDto } from "../dto/register.account.dto";
import { IServiceResponse } from "@app/rabbit";
import { AccountEntity } from '../entity/account.entity';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Database } from '@app/database';
import { ACCOUNT_MESSAGE_DB_RESPONSE } from '../constant/account-patterns.constants';
import { LoginAccountDto } from '../dto/login.account.dto';
import { CognitoService } from '@libs/cognito';
import { TokenAccountDto } from '../dto/token.account.dto';
import { AuthVerifyUserDto } from '../dto/verify-email.account.dto';
import { RefreshTokenAccountDto } from '../dto/refresh-token.account.dto';
import { MemberEntity } from 'apps/member/src/entity/member.entity';

@Injectable()
export class AccountService {

  private saltOrRounds = 10

  constructor(
    @InjectRepository(AccountEntity, Database.PRIMARY) private accountRepository: Repository<AccountEntity>,
    @Inject(CognitoService) private awsCognitoService: CognitoService) { }

  async findByEmail(email: string): Promise<IServiceResponse<AccountEntity>> {

    const account = await this.accountRepository.findOneBy(
      {
        email: email
      }
    );

    if ( account === null ) {
      console.log('account ---> null ' + JSON.stringify(account) );
    }

    return {
      state: !!account,
      data: account,
      message: !!account ? ACCOUNT_MESSAGE_DB_RESPONSE.EMAIL_FOUND : ACCOUNT_MESSAGE_DB_RESPONSE.EMAIL_NOT_FOUND
    }
  }

  async register(createAccountDto: RegisterAccountDto): Promise<IServiceResponse<AccountEntity>> {
    try {
      // TODO replace this with a validation injection
      // https://gist.github.com/zarv1k/3ce359af1a3b2a7f1d99b4f66a17f1bc
      const accountExist = await this.findByEmail(createAccountDto.email);
      if (accountExist.state) {
        return {
          state: accountExist.state,
          data: accountExist.data,
          message: ACCOUNT_MESSAGE_DB_RESPONSE.EXISTING_EMAIL
        };
      }

      const password = createAccountDto.password;
      const hash = await bcrypt.hash(password, this.saltOrRounds);
      createAccountDto.password = hash;

      const result = await this.accountRepository.save(createAccountDto);

      await this.awsCognitoService.registerUser(
        createAccountDto.email,
        password
      )

      return {
        state: !!result,
        data: result,
        message: ACCOUNT_MESSAGE_DB_RESPONSE.CREATED
      };

    } catch (e) {
      return {
        state: false,
        data: e.name
      };
    }
  }

  async login(loginAccountDto: LoginAccountDto): Promise<IServiceResponse<TokenAccountDto>> {

    try {
      const cognitoToken = await this.awsCognitoService.authenticateUser(
        loginAccountDto.email,
        loginAccountDto.password,
      )

      let tokenAccountDto = new TokenAccountDto()
      tokenAccountDto.accessToken = cognitoToken['idToken']['jwtToken']
      tokenAccountDto.refreshToken = cognitoToken['refreshToken']['token']

      // TODO: Save token & refresh token into DB

      return {
        state: true,
        data: tokenAccountDto,
        message: ACCOUNT_MESSAGE_DB_RESPONSE.EMAIL_FOUND
      };
    } catch (e) {
      return {
        state: false,
        data: e.name,
        message: ACCOUNT_MESSAGE_DB_RESPONSE.NOT_FOUND
      };
    }

  }

  async verifyEmail(authVerifyUserDto: AuthVerifyUserDto): Promise<IServiceResponse<UpdateResult>> {
    let updateResult = null
    try {
      await this.awsCognitoService.verifyUser(
        authVerifyUserDto.email,
        authVerifyUserDto.confirmationCode,
      ).then(
        result => {
          updateResult = this.accountRepository.update(
            {
              email: authVerifyUserDto.email
            },
            {
              verified: true
            }
          );
        },
        error => {
          throw new BadRequestException(
            'Something bad happened',
            { cause: new Error(), description: error }
          )
        }
      )

      // TODO: Save token & refresh token into DB

      return {
        state: true,
        data: updateResult,
        message: ACCOUNT_MESSAGE_DB_RESPONSE.EMAIL_FOUND
      };
    } catch (e) {
      return {
        state: true,
        data: null,
        message: ACCOUNT_MESSAGE_DB_RESPONSE.NOT_FOUND
      };
    }

  }

  async refreshToken(refreshTokenAccountDto: RefreshTokenAccountDto): Promise<IServiceResponse<TokenAccountDto>> {

    try {
      const cognitoToken = await this.awsCognitoService.refreshToken(
        refreshTokenAccountDto.email,
        refreshTokenAccountDto.refreshToken,
      )

      let tokenAccountDto = new TokenAccountDto()
      tokenAccountDto.accessToken = cognitoToken['idToken']['jwtToken']
      tokenAccountDto.refreshToken = cognitoToken['refreshToken']['token']

      // TODO: Save new token into DB

      return {
        state: true,
        data: tokenAccountDto,
        message: ACCOUNT_MESSAGE_DB_RESPONSE.EMAIL_FOUND
      };
    } catch (e) {
      return {
        state: true,
        data: null,
        message: ACCOUNT_MESSAGE_DB_RESPONSE.NOT_FOUND
      };
    }

  }

}
