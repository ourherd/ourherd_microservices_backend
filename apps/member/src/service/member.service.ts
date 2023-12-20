import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MemberEntity } from "../entity/member.entity";
import { Repository } from "typeorm";
import { CreateMemberDto } from "../dto/create-member.dto";
import { UpdateMemberDto } from "../dto/update-member.dto";
import { IServiceResponse } from "@app/rabbit";
import { IPagination, PaginationDto } from "@app/common";
import { Database } from "@app/database";
import { MEMBER_MESSAGE_DB_RESPONSE } from "../constant/member-patterns.constants";
import { MemberVerificationEntity } from "../entity/member-verification.entity";
import { MemberPrivacyDto } from "../dto/member-privacy.dto";
import { isEmptyOrNull } from "@app/common/validation-rules/object-validation.rule";

@Injectable()
export class MemberService {

  private readonly logger = new Logger(MemberService.name);

  constructor(
    @InjectRepository(MemberEntity, Database.PRIMARY) private memberRepository: Repository<MemberEntity>,
    //TODO move it no being used
    @InjectRepository(MemberVerificationEntity, Database.PRIMARY)
    private memberVerificationRepository: Repository<MemberVerificationEntity>  ) { }

  async create(createDto: CreateMemberDto): Promise<IServiceResponse<MemberEntity>> {
    try {
      this.logger.log('member dto--> ' + JSON.stringify(createDto));
      const member = this.memberRepository.create(createDto);
      const result = await this.memberRepository.save(member);

      return {
        state: !!result,
        data: member,
        message: !!result ?
          MEMBER_MESSAGE_DB_RESPONSE.CREATED : MEMBER_MESSAGE_DB_RESPONSE.CREATED_FAILED
      };

    } catch (error) {
      this.logger.error('member dto error --> ' + JSON.stringify(error));
      return {
        state: false,
        data: error,
        message: error.name
      };
    }

  }

  async update(member_id: string, updateDto: UpdateMemberDto): Promise<IServiceResponse<MemberEntity>> {
    const { state, data: member } = await this.findById(member_id);

    if (state) {
      Object.assign(member, updateDto);
      const result = await this.memberRepository.save(member);
      return {
        state: !!result,
        data: result,
        message: MEMBER_MESSAGE_DB_RESPONSE.UPDATED
      }

    } else {
      return {
        state: false,
        data: null,
        message: MEMBER_MESSAGE_DB_RESPONSE.UPDATED_FAILED
      }
    }
  }

  async findById(id: string): Promise<IServiceResponse<MemberEntity>> {
    const member = await this.memberRepository.findOneBy({ id });

    return {
      state: !!member,
      data: member,
      message: !!member ? MEMBER_MESSAGE_DB_RESPONSE.FOUND : MEMBER_MESSAGE_DB_RESPONSE.NOT_FOUND
    }
  }

  async findByEmail(email: string): Promise<IServiceResponse<MemberEntity>> {
    const member = await this.memberRepository.findOneBy(
      {
        email: email
      }
    );

    return {
      state: !!member,
      data: member,
      message: !!member ? MEMBER_MESSAGE_DB_RESPONSE.EMAIL_FOUND : MEMBER_MESSAGE_DB_RESPONSE.EMAIL_NOT_FOUND
    }
  }

  async findAll({ limit, page }: PaginationDto): Promise<IServiceResponse<IPagination<MemberEntity>>> {
    const members = await this.memberRepository.find({
      skip: (page - 1) * limit,
      take: limit - 1
    });
    const membersCount = await this.memberRepository.count();
    return {
      state: true,
      data: {
        items: members,
        limit: limit,
        page: page,
        total: membersCount
      }
    }
  }

  async checkMemberExist(member_id: string): Promise<boolean> {
    const member = this.findById(member_id)
    return !!member
  }

  async memberPrivacySetting(member_id: string): Promise<MemberPrivacyDto> {

    let memberPrivacyDto = new MemberPrivacyDto;
    memberPrivacyDto.member = (await this.findById(member_id)).data

    if (!isEmptyOrNull(memberPrivacyDto.member.gender)) {
      memberPrivacyDto.share_gender = false;
    }
    if (!isEmptyOrNull(memberPrivacyDto.member.birthday)) {
      memberPrivacyDto.share_age = false;
    }

    if (!isEmptyOrNull(memberPrivacyDto.member.first_name)) {
      memberPrivacyDto.share_name = false;
    }

    if (
      !isEmptyOrNull(memberPrivacyDto.member.country) ||
      !isEmptyOrNull(memberPrivacyDto.member.suburb) ||
      !isEmptyOrNull(memberPrivacyDto.member.postal_code)
      ) {
      memberPrivacyDto.share_location = false;
    }
    return memberPrivacyDto
  }

  async memberVerified (member_id: string): Promise<IServiceResponse<MemberEntity>> {
    const member = await this.findById(member_id);
    return {
      state: member.data.verified,
      data: member.data.verified ? member.data: null,
      message: member.data.verified ? MEMBER_MESSAGE_DB_RESPONSE.VERIFIED : MEMBER_MESSAGE_DB_RESPONSE.NO_VERIFIED
    }
  }
}
