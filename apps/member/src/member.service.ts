import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberEntity } from './entity/member.entity';
import { Repository } from 'typeorm';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import _ from 'lodash';
import { IServiceResponse } from '@app/rabbit';
import { IPagination, PaginationDto } from '@app/common';
import { Database } from '@app/database';
import { MEMBER_MESSAGE_DB_RESPONSE } from "./constant/member-patterns.constants";

@Injectable()
export class MemberService {

  private readonly logger = new Logger(MemberService.name);

  constructor(
      @InjectRepository(MemberEntity, Database.PRIMARY)
        private memberRepository: Repository<MemberEntity>,
  ) {

  }

  async create(createDto: CreateMemberDto): Promise<IServiceResponse<MemberEntity>> {
    const memberExist = await this.findByEmail(createDto.email);

    this.logger.log('member already exist --> ' + JSON.stringify('email '
      + createDto.email +' --> ' + memberExist.message));

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
      data: result,
      message: !!result ?
          MEMBER_MESSAGE_DB_RESPONSE.CREATED : MEMBER_MESSAGE_DB_RESPONSE.CREATED_FAILED
    };
  }

  async update(id: string, updateDto: UpdateMemberDto): Promise<IServiceResponse<MemberEntity>> {
    const { state, data: member } = await this.findById(id);

    if (state) {
      Object.assign( member, updateDto);
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
        email
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
