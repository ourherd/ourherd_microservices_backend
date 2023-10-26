import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterAccountDto } from "./dto/register.account.dto";
import { IServiceResponse } from "@app/rabbit";
import { AccountEntity } from './entity/account.entity';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Database } from '@app/database';
import { ACCOUNT_MESSAGE_DB_RESPONSE } from './constant/account-patterns.constants';
import { LoginAccountDto } from './dto/login.account.dto';
import { CognitoService } from '@libs/cognito';
import { AuthChangePasswordUserDto } from './dto/change-password.account.dto';
import { TokenAccountDto } from './dto/token.account.dto';
import { AuthVerifyUserDto } from './dto/verify-email.account.dto';
import { RefreshTokenAccountDto } from './dto/refresh-token.account.dto';

@Injectable()
export class AccountService {

  private saltOrRounds = 10

  constructor(
    @InjectRepository(AccountEntity, Database.PRIMARY) private accountRepository: Repository<AccountEntity>,
    @Inject(CognitoService) private awsCognitoService: CognitoService) {}

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

  async register(createAccoutDto: RegisterAccountDto): Promise<IServiceResponse<AccountEntity>> {

    const accountExist = await this.findByEmail(createAccoutDto.email);
    const password = createAccoutDto.password

    if (accountExist.state) {
      return {
        state: accountExist.state,
        data: accountExist.data,
        message: ACCOUNT_MESSAGE_DB_RESPONSE.EMAIL_FOUND
      };
    }

    const hash = await bcrypt.hash(createAccoutDto.password, this.saltOrRounds);
    createAccoutDto.password = hash
    const accountEntity = this.accountRepository.create(createAccoutDto);
    const result = await this.accountRepository.save(accountEntity);

    await this.awsCognitoService.registerUser(
      createAccoutDto.email,
      password
    )

    return {
      state: !!result,
      data: result,
      message: ACCOUNT_MESSAGE_DB_RESPONSE.CREATED
    };
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

  // TODO MOVE THIS INTO A SERVICE
  async changePassword(authChangePasswordUserDto: AuthChangePasswordUserDto): Promise<IServiceResponse<UpdateResult>> {

    try {

      await this.awsCognitoService.changeUserPassword(
        authChangePasswordUserDto.email,
        authChangePasswordUserDto.currentPassword,
        authChangePasswordUserDto.newPassword,
      )

      let result = null
      result = this.updatePassword(
        authChangePasswordUserDto.email,
        authChangePasswordUserDto.newPassword
      ).then(
        updateRsult => { result = updateRsult }
      )

      return {
        state: true,
        data: result
      }
    } catch (e) {
      return {
        state: false,
        data: e.name,
        message: ACCOUNT_MESSAGE_DB_RESPONSE.NOT_FOUND
      };
    }

  }

  async resetPassword(authConfirmPasswordUserDto: AuthChangePasswordUserDto): Promise<IServiceResponse<UpdateResult>> {

    try {


      await this.awsCognitoService.confirmUserPassword(
        authConfirmPasswordUserDto.email,
        authConfirmPasswordUserDto.confirmationCode,
        authConfirmPasswordUserDto.newPassword,
      )

      let result = null
      this.updatePassword(
        authConfirmPasswordUserDto.email,
        authConfirmPasswordUserDto.newPassword
      ).then(
        updateRsult => { result = updateRsult }
      )

      return {
        state: true,
        data: result
      }
    } catch (e) {
      return {
        state: true,
        data: null,
        message: ACCOUNT_MESSAGE_DB_RESPONSE.NOT_FOUND
      };
    }

  }

  async updatePassword(email: string, password: string): Promise<UpdateResult> {
    return await this.accountRepository.update(
      {
        email: email
      },
      {
        password: await bcrypt.hash(password, this.saltOrRounds)
      }
    );
  }


}
