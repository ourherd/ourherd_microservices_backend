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
import { AuthChangePasswordUserDto } from '../dto/change-password.account.dto';
import { TokenAccountDto } from '../dto/token.account.dto';
import { AuthVerifyUserDto } from '../dto/verify-email.account.dto';
import { RefreshTokenAccountDto } from '../dto/refresh-token.account.dto';

@Injectable()
export class PasswordService {

  private saltOrRounds = 10

  constructor(
    @InjectRepository(AccountEntity, Database.PRIMARY) private accountRepository: Repository<AccountEntity>,
    @Inject(CognitoService) private awsCognitoService: CognitoService) {}

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
