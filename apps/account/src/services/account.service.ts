import { BadRequestException, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
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
import { EmailVerificationEntity } from '../entity/email-verification.entity';
import { v4 } from 'uuid';

@Injectable()
export class AccountService {

  private saltOrRounds = 10

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

      this.createEmailToken(createAccountDto.email);

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

  async createEmailToken(email: string): Promise<boolean> {
    const emailVerification = await this.emailVerificationRepository.findOneBy({email: email}); 
    const durationTime = (new Date().getTime() - emailVerification.created_at.getTime()) / 60000;
    if (emailVerification && ( durationTime < 15 )) {
      throw new HttpException('LOGIN.EMAIL_SENT_RECENTLY', HttpStatus.INTERNAL_SERVER_ERROR);
    } else {
      var emailVerificationModel = await this.emailVerificationRepository.update( 
        {email: email},
        { 
          email: email,
          emailToken: v4(),
          created_at: new Date()
        }
      );
      return true;
    }
  }

  async sendEmailVerification(email: string): Promise<boolean> {   
    var model = await this.emailVerificationRepository.findOneBy({ email: email});

    if(model && model.emailToken){
        let transporter = nodemailer.createTransport({
            host: config.mail.host,
            port: config.mail.port,
            secure: config.mail.secure, // true for 465, false for other ports
            auth: {
                user: config.mail.user,
                pass: config.mail.pass
            }
        });
    
        let mailOptions = {
          from: '"Company" <' + config.mail.user + '>', 
          to: email, // list of receivers (separated by ,)
          subject: 'Verify Email', 
          text: 'Verify Email', 
          html: 'Hi! <br><br> Thanks for your registration<br><br>'+
          '<a href='+ config.host.url + ':' + config.host.port +'/auth/email/verify/'+ model.emailToken + '>Click here to activate your account</a>'  // html body
        };
    
        var sent = await new Promise<boolean>(async function(resolve, reject) {
          return await transporter.sendMail(mailOptions, async (error, info) => {
              if (error) {      
                console.log('Message sent: %s', error);
                return reject(false);
              }
              console.log('Message sent: %s', info.messageId);
              resolve(true);
          });      
        })

        return sent;
    } else {
      throw new HttpException('REGISTER.USER_NOT_REGISTERED', HttpStatus.FORBIDDEN);
    }
  }

  async verifyEmail(authVerifyUserDto: AuthVerifyUserDto): Promise<IServiceResponse<UpdateResult>> {
    let updateResult = null
    try {

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
