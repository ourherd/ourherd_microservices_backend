import { Inject, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IServiceResponse } from "@app/rabbit";
import { AccountEntity } from '../entity/account.entity';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Database } from '@app/database';

import { ACCOUNT_MESSAGE_DB_RESPONSE } from '../constant/account-patterns.constants';
import { CognitoService } from '@libs/cognito';
import { AuthChangePasswordUserDto } from '../dto/change-password.account.dto';
import { ResetPasswordVerificationEntity } from '../entity/reset-password-verification.entity';
import { MailSengridService } from '@app/mail/mail.sengrid.service';
import { v4 } from 'uuid';

@Injectable()
export class PasswordService {

  private readonly logger = new Logger(PasswordService.name);
  private saltOrRounds = 10
  private hourDivide = 600000
  private expired_verify_time = 48

  constructor(
    @InjectRepository(AccountEntity, Database.PRIMARY) private accountRepository: Repository<AccountEntity>,
    @InjectRepository(ResetPasswordVerificationEntity, Database.PRIMARY) private resetPasswordVerificationRepository: Repository<ResetPasswordVerificationEntity>,
    @Inject(CognitoService) private awsCognitoService: CognitoService,
    @Inject(MailSengridService) private mailSengridService: MailSengridService,
  ) { }

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

  async forgotUserPassword(email: string): Promise<IServiceResponse<ResetPasswordVerificationEntity>> {

    try {


      const accountEntity = await this.accountRepository.findOneBy({ email: email });
      const emailVerification = await this.resetPasswordVerificationRepository.findOneBy({
        email: email
      });

      const resetPasswordEmailVerificationObj = {
        email: email,
        email_token: v4(),
        account: accountEntity,
        created_at: new Date()
      }

      const sendEmailResult = this.mailSengridService.send({
        to: email,
        from: "hello@ourherd.io",
        subject: "reset Email",
        templateId: "d-ee13b615ae3f4863ba554fdf9a842268",
        dynamicTemplateData: {
          token: resetPasswordEmailVerificationObj.email_token
        }
      })

      if (!!emailVerification === false) {
        const emailVerificationEntity = this.resetPasswordVerificationRepository.create(
          resetPasswordEmailVerificationObj
        )

        await this.resetPasswordVerificationRepository.save(
          emailVerificationEntity
        );

        return {
          state: true,
          data: emailVerificationEntity,
        }
      }


    } catch (error) {
      this.logger.error("request reset password Error", error)
    }



  }

  async resetPassword(authConfirmPasswordUserDto: AuthChangePasswordUserDto): Promise<IServiceResponse<UpdateResult>> {

    try {

      

      const emailVerif = await this.resetPasswordVerificationRepository.findOne({
        where: { email_token: authConfirmPasswordUserDto.confirmationCode },
        relations: ['account']
      });

      this.logger.debug(emailVerif)

      if (!!emailVerif == true && emailVerif.email) {

        const durationTime = (new Date().getTime() - emailVerif.created_at.getTime()) / this.hourDivide;
        if (durationTime > this.expired_verify_time) {
          return {
            state: false,
            data: null,
            message: 'ACCOUNT.VERIFY_TOKEN_EXPIRED'
          };
        }

        if (emailVerif.account) {
          const updatePassword = await this.updatePassword(
            emailVerif.email,
            authConfirmPasswordUserDto.newPassword
          )

          this.awsCognitoService.cognitoResetPassword(
            emailVerif.email,
            authConfirmPasswordUserDto.newPassword
          )

          await this.resetPasswordVerificationRepository.remove(emailVerif);
          return {
            state: !!updatePassword,
            data: updatePassword
          };
        }
      } else {

        return {
          state: false,
          data: null,
          message: 'ACCOUNT.VERIFY_TOKEN_NOT_FOUND'
        };

      }


    }
    catch (e) {

      this.logger.error("resetPassword Error: ", e)

      return {
        state: false,
        data: e,
        message: ACCOUNT_MESSAGE_DB_RESPONSE.UPDATED_FAILED
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
