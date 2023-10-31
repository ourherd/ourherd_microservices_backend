import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
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
import { EmailVerificationEntity } from '../entity/email-verification.entity';
import { v4 } from 'uuid';
import { plainToClass } from 'class-transformer';
import { SendMailerDto } from 'apps/mailer/src/dto/send.mailer.dto';

@Injectable()
export class AccountService {

  private saltOrRounds = 10
  private hourDivide = 6000

  constructor(
    @InjectRepository(AccountEntity, Database.PRIMARY) private accountRepository: Repository<AccountEntity>,
    @InjectRepository(EmailVerificationEntity, Database.PRIMARY) private emailVerificationRepository: Repository<EmailVerificationEntity>,
    @Inject(CognitoService) private awsCognitoService: CognitoService
  ) { }

  async findByEmail(email: string): Promise<IServiceResponse<AccountEntity>> {

    const account = await this.accountRepository.findOneBy(
      {
        email: email
      }
    );

    if (account === null) {
      console.log('account ---> null ' + JSON.stringify(account));
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

  async createEmailToken(email: string): Promise<IServiceResponse<SendMailerDto>> {

    try {

      const emailVerification = await this.emailVerificationRepository.findOneBy({ email: email });

      const emailVerificationObj = {
        email: email,
        email_token: v4(),
        created_at: new Date()
      }

      const sendMailObj = {
        email: email,
        subject: "Verify Email",
        html: 'Hi! <br><br> Thanks for your registration<br><br>' +
          '<a href=' + 'localhost' + ':' + '3020' +
          '/api/account/email/verify/' + emailVerificationObj.email_token +
          '>Click here to activate your account</a>'
      }



      const sendMailerDto = plainToClass(SendMailerDto, sendMailObj);
      const emailVerificationEntity = this.emailVerificationRepository.create(emailVerificationObj)
      if (!!emailVerification === false) {
        await this.emailVerificationRepository.save(
          emailVerificationEntity
        );
        return {
          state: true,
          data: sendMailerDto
        }
      }

      const durationTime = (new Date().getTime() - emailVerification.created_at.getTime()) / this.hourDivide;
      if (emailVerification && (durationTime > 48)) {
        throw new HttpException('ACCOUNT.EMAIL_SENT_RECENTLY', HttpStatus.INTERNAL_SERVER_ERROR);
      } else {
        var emailVerificationModel = await this.emailVerificationRepository.update(
          { email: email },
          emailVerificationEntity
        );
        return {
          state: true,
          data: sendMailerDto
        }
      }

    } catch (e) {
      return {
        state: true,
        data: e.name,
        message: e.message
      };
    }
  }

  async verifyEmail(authVerifyUserDto: AuthVerifyUserDto): Promise<IServiceResponse<UpdateResult>> {
    try {

      let emailVerif = await this.emailVerificationRepository.findOneBy({
        email_token: authVerifyUserDto.confirmationCode
      });

      

      if (!!emailVerif == true && emailVerif.email) {

        const durationTime = (new Date().getTime() - emailVerif.created_at.getTime()) / this.hourDivide;

        if (durationTime > 48) {
          return {
            state: false,
            data: null,
            message: 'ACCOUNT.VERIFY_TOKEN_EXPIRED'
          };
        }

        var accountFromDb = await this.accountRepository.findOneBy({ email: emailVerif.email });
        if (accountFromDb) {
          accountFromDb.verified = true
          var savedUser = await this.accountRepository.update(
            { email: emailVerif.email },
            accountFromDb
          );
          await this.emailVerificationRepository.remove(emailVerif);
          return {
            state: !!savedUser,
            data: savedUser
          };
        }
      } else {

        return {
          state: false,
          data: null,
          message: 'ACCOUNT.VERIFY_TOKEN_NOT_FOUND'
        };

      }

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
