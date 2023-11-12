import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiOperation } from '@nestjs/swagger';
import { MemberService } from '../service/member.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MEMBER_EVENT_PATTERNS, MEMBER_MESSAGE_PATTERNS } from "../constant/member-patterns.constants";
import { MemberEntity } from '../entity/member.entity';
import { CreateMemberDto } from '../dto/create-member.dto';
import { UpdateMemberDto } from '../dto/update-member.dto';
import { IServiceResponse } from '@app/rabbit';
import { IPagination, PaginationDto } from '@app/common';
import { ACCOUNT_MESSAGE_PATTERNS } from 'apps/account/src/constant/account-patterns.constants';
import { SendMailerDto } from 'apps/mailer/src/dto/send.mailer.dto';
import { UpdateResult } from 'typeorm';
import { VerifyUserDto } from '../dto/verify-email.member.dto';
import { EmailVerifyTokenDto } from '../dto/email-verify-token.account.dto';
import { MemberMailService } from "../service/member.mail.service";

@Controller()
export class MemberController {
  constructor(
    private readonly memberService: MemberService,
    // private readonly mailService: MemberMailService,
  ) {}

  @MessagePattern(MEMBER_EVENT_PATTERNS.CREATED)
  async createMember(
    @Payload('createDto') createDto: CreateMemberDto) {
    await this.memberService.create(createDto);
    const sendMailerDto = this.mailService.sentEmailToken(memberCreateResult.data.email);
    // return sendMailerDto;
  }

  @MessagePattern(MEMBER_MESSAGE_PATTERNS.UPDATE)
  async updateMember(
    @Payload('member_id') member_id: string,
    @Payload('updateDto') updateDto: UpdateMemberDto
  ): Promise<IServiceResponse<MemberEntity>> {
    return await this.memberService.update(member_id, updateDto);
  }

  // Only admin
  @MessagePattern(MEMBER_MESSAGE_PATTERNS.FIND_ALL)
  async getMember(@Payload() paginationDto: PaginationDto): Promise<IServiceResponse<IPagination<MemberEntity>>> {
    return await this.memberService.findAll(paginationDto);
  }

  // Only admin
  @MessagePattern(MEMBER_MESSAGE_PATTERNS.FIND_BY_ID)
  async getMemberById(@Payload() id: string): Promise<IServiceResponse<MemberEntity>> {
    return await this.memberService.findById(id);
  }

}
