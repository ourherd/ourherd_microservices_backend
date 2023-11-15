import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MemberEntity } from "../entity/member.entity";
import { Database } from "@app/database";
import { Repository } from "typeorm";
import { MemberVerificationEntity } from "../entity/member-verification.entity";
import { EmailVerifyTokenDto } from "../dto/email-verify-token.account.dto";
import { IServiceResponse } from "@app/rabbit";
import { v4 } from "uuid";
import { MEMBER_MESSAGE_DB_RESPONSE } from "../constant/member-patterns.constants";

@Injectable()
export class MemberVerificationService {

  private readonly logger = new Logger(MemberVerificationService.name);
  private hourDivide = 600000;
  private expired_verify_time = 48;
  private LIMIT_REQUEST_BY_HOUR = 3;

  constructor(
    @InjectRepository(MemberEntity, Database.PRIMARY) private memberRepository: Repository<MemberEntity>,
    @InjectRepository(MemberVerificationEntity, Database.PRIMARY) private memberVerificationRepository:
                                                          Repository<MemberVerificationEntity>,
    ) { }


  /**
   * Request email verification
   * @param verifyDto
   */
  async memberVerificationToken ( verifyTokenDto: EmailVerifyTokenDto )
    : Promise<IServiceResponse<MemberVerificationEntity>> {

    const member = await this.verifyMemberEmail( verifyTokenDto );
    const verify = {
      email: verifyTokenDto.email,
      email_token: verifyTokenDto.token === null ? v4() : verifyTokenDto.token,
      member: member
    }

    const memberVerification = this.memberVerificationRepository.create(verify);
    const save = await this.memberVerificationRepository.save(memberVerification);

    return {
      state: !!save,
      data: memberVerification,
      message: MEMBER_MESSAGE_DB_RESPONSE.CREATED
    };
  }

  /**
   * Request verifyMemberEmail
   * @param verifyDto
   */
  private async verifyMemberEmail ( verifyTokenDto: EmailVerifyTokenDto ): Promise<MemberEntity> {
    const member = await this.memberRepository.findOneBy(
      {
      id: verifyTokenDto.member_id,
      email: verifyTokenDto.email
    });
    if (member === null) {
      throw new HttpException('MEMBER.N0_EXISTS', HttpStatus.BAD_REQUEST);
    }
    return member;
  }

}
