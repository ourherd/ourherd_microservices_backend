import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MemberEntity } from "../entity/member.entity";
import { Database } from "@app/database";
import { Repository, UpdateResult } from "typeorm";
import { MemberVerificationEntity } from "../entity/member-verification.entity";
import { IServiceResponse } from "@app/rabbit";
import { SendMailerDto } from "../../../mailer/src/dto/send.mailer.dto";
import { v4 } from "uuid";
import { plainToClass } from "class-transformer";
import { VerifyUserDto } from "../dto/verify-email.member.dto";
import { MEMBER_MESSAGE_DB_RESPONSE } from "../constant/member-patterns.constants";

@Injectable()
export class MemberMailService {

  private readonly logger = new Logger(MemberMailService.name);
  private hourDivide = 600000
  private expired_verify_time = 48

  constructor(
    @InjectRepository(MemberEntity, Database.PRIMARY)
    private memberRepository: Repository<MemberEntity>,
    @InjectRepository(MemberVerificationEntity, Database.PRIMARY)
    private memberVerificationRepository: Repository<MemberVerificationEntity>  ) { }


  // TODO NO NEED TO RETURN ANYTHING
  async sentEmailToken(email: string): Promise<IServiceResponse<SendMailerDto>> {

    try {

      const memberEntity = await this.memberRepository.findOneBy({ email: email });
      if (!!memberEntity === true && memberEntity.verified === true) {
        throw new HttpException('ACCOUNT.BAD_REQUEST', HttpStatus.BAD_REQUEST);
      }

      const emailVerification = await this.memberVerificationRepository.findOneBy({
        email: email
      });

      const emailVerificationObj = {
        email: email,
        email_token: v4(),
        member: memberEntity,
        created_at: new Date()
      }

      const verifyLink = '"http://' + process.env.WEBSITE_URL + '/api/member/verify/' + emailVerificationObj.email_token + '"';
      const sendMailObj = {
        email: email,
        subject: "Verify Email",
        html: 'Hi! <br><br> Thanks for your registration<br><br>' +
          '<a href='+ verifyLink +'>Click here to activate your account</a>'
      }

      const sendMailerDto = plainToClass(SendMailerDto, sendMailObj);
      const emailVerificationEntity = this.memberVerificationRepository.create(emailVerificationObj)

      if (!!emailVerification === false) {

          await this.memberVerificationRepository.save(
            emailVerificationEntity
          );
          return {
            state: true,
            data: sendMailerDto
          }
      }

      const durationTime = (new Date().getTime() - emailVerification.created_at.getTime()) / this.hourDivide;

      if (emailVerification && (durationTime > this.expired_verify_time)) {
        throw new HttpException('ACCOUNT.EMAIL_SENT_RECENTLY', HttpStatus.INTERNAL_SERVER_ERROR);
      } else {

        await this.memberVerificationRepository.update(
          { email: email },
          emailVerificationEntity
        );

        return {
          state: true,
          data: sendMailerDto
        }
      }

    } catch (e) {
      this.logger.error("Create Verify Email:", e)
      return {
        state: false,
        data: e.name,
        message: e.message
      };
    }
  }

  async verifyEmail(authVerifyUserDto: VerifyUserDto): Promise<IServiceResponse<UpdateResult>> {
    try {

      let emailVerif = await this.memberVerificationRepository.findOneBy({
        email_token: authVerifyUserDto.confirmationCode
      });

      if (!!emailVerif == true && emailVerif.email) {

        const durationTime = (new Date().getTime() - emailVerif.created_at.getTime()) / this.hourDivide;
        this.logger.log(durationTime)
        if (durationTime > this.expired_verify_time) {
          return {
            state: false,
            data: null,
            message: 'ACCOUNT.VERIFY_TOKEN_EXPIRED'
          };
        }

        const accountFromDb = await this.memberRepository.findOneBy({ email: emailVerif.email });
        if (accountFromDb) {
          var savedUser = await this.memberRepository.update(
            { email: emailVerif.email },
            {
              verified: true
            }
          );
          await this.memberVerificationRepository.remove(emailVerif);
          return {
            state: !!savedUser,
            data: savedUser
          };
        }
      } else {

        return {
          state: false,
          data: null,
          message: 'MEMBER.VERIFY_TOKEN_NOT_FOUND'
        };

      }

    } catch (e) {
      this.logger.error("Verify Error", e)
      return {
        state: true,
        data: e,
        message: MEMBER_MESSAGE_DB_RESPONSE.NOT_FOUND
      };
    }

  }

}
