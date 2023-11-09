import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberEntity } from '../entity/member.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateMemberDto } from '../dto/create-member.dto';
import { UpdateMemberDto } from '../dto/update-member.dto';
import _ from 'lodash';
import { IServiceResponse } from '@app/rabbit';
import { IPagination, PaginationDto } from '@app/common';
import { Database } from '@app/database';
import { MEMBER_MESSAGE_DB_RESPONSE } from "../constant/member-patterns.constants";
import { MemberVerificationEntity } from '../entity/member-verification.entity';
import { v4 } from 'uuid';
import { plainToClass } from 'class-transformer';
import { SendMailerDto } from 'apps/mailer/src/dto/send.mailer.dto';
import { VerifyUserDto } from '../dto/verify-email.member.dto';

@Injectable()
export class MemberService {

  private readonly logger = new Logger(MemberService.name);

  constructor(
    @InjectRepository(MemberEntity, Database.PRIMARY)
    private memberRepository: Repository<MemberEntity>,
    @InjectRepository(MemberVerificationEntity, Database.PRIMARY) private memberVerificationRepository: Repository<MemberVerificationEntity>  ) { }

  async create(createDto: CreateMemberDto): Promise<IServiceResponse<MemberEntity>> {
    try {

      const memberExist = await this.findByEmail(createDto.email);

      if (!!memberExist.state) {
        return {
          state: !!memberExist.state,
          data: memberExist.data,
          message: memberExist.message
        };
      }

      const member = this.memberRepository.create(createDto);
      const result = await this.memberRepository.save(member);

      this.logger.log('member status--> ' + JSON.stringify(
        !!result ?
          MEMBER_MESSAGE_DB_RESPONSE.CREATED : MEMBER_MESSAGE_DB_RESPONSE.CREATED_FAILED
      ));

      return {
        state: !!result,
        data: member,
        message: !!result ?
          MEMBER_MESSAGE_DB_RESPONSE.CREATED : MEMBER_MESSAGE_DB_RESPONSE.CREATED_FAILED
      };

    } catch (error) {
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

}
