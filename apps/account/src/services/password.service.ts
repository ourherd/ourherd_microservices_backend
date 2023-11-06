import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IServiceResponse } from "@app/rabbit";
import { AccountEntity } from '../entity/account.entity';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Database } from '@app/database';
import { ACCOUNT_MESSAGE_DB_RESPONSE } from '../constant/account-patterns.constants';
import { CognitoService } from '@libs/cognito';
import { AuthChangePasswordUserDto } from '../dto/change-password.account.dto';

@Injectable()
export class PasswordService {

  private saltOrRounds = 10

  constructor(
    @InjectRepository(AccountEntity, Database.PRIMARY) private accountRepository: Repository<AccountEntity>,
    @Inject(CognitoService) private awsCognitoService: CognitoService) {}

  async changePassword(authChangePasswordUserDto: AuthChangePasswordUserDto): Promise<IServiceResponse<UpdateResult>> {

    try {

      const cognitoResult = await this.awsCognitoService.changeUserPassword(
        authChangePasswordUserDto.email,
        authChangePasswordUserDto.currentPassword,
        authChangePasswordUserDto.newPassword,
      )

      const result = await this.updatePassword(
        authChangePasswordUserDto.email,
        authChangePasswordUserDto.newPassword
      )

      return {
        state: true,
        data: result
      }
    } catch (e) {
      return {
        state: false,
        data: e,
        message: ACCOUNT_MESSAGE_DB_RESPONSE.NOT_FOUND
      };
    }

  }

  async resetPassword(authConfirmPasswordUserDto: AuthChangePasswordUserDto): Promise<IServiceResponse<UpdateResult>> {

    try {

      const cognitoResult = await this.awsCognitoService.confirmUserPassword(
        authConfirmPasswordUserDto.email,
        authConfirmPasswordUserDto.confirmationCode,
        authConfirmPasswordUserDto.newPassword,
      )

      const result = await this.updatePassword(
        authConfirmPasswordUserDto.email,
        authConfirmPasswordUserDto.newPassword
      )

      return {
        state: true,
        data: result
      }
    } catch (e) {
      return {
        state: false,
        data: e,
        message: ACCOUNT_MESSAGE_DB_RESPONSE.NOT_FOUND
      };
    }

  }

  async updatePassword(email: string, password: string): Promise<UpdateResult> {
    return this.accountRepository.update(
      {
        email: email
      },
      {
        password: await bcrypt.hash(password, this.saltOrRounds)
      }
    );
  }


}
