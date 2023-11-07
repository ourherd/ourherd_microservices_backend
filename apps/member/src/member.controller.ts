import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiOperation } from '@nestjs/swagger';
import { MemberService } from './member.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MEMBER_MESSAGE_PATTERNS } from './constant/member-patterns.constants';
import { MemberEntity } from './entity/member.entity';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { IServiceResponse } from '@app/rabbit';
import { IPagination, PaginationDto } from '@app/common';
import { ACCOUNT_MESSAGE_PATTERNS } from 'apps/account/src/constant/account-patterns.constants';
import { SendMailerDto } from 'apps/mailer/src/dto/send.mailer.dto';
import { UpdateResult } from 'typeorm';
import { VerifyUserDto } from './dto/verify-email.member.dto';
import { EmailVerifyTokenDto } from './dto/email-verify-token.account.dto';

@Controller()
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @MessagePattern(MEMBER_MESSAGE_PATTERNS.CREATE)
  async createMember(
    @Payload('createDto') createDto: CreateMemberDto): Promise<IServiceResponse<SendMailerDto>> {
    const memberCreateResult = await this.memberService.create(createDto);
    const sendMailerDto = this.memberService.createEmailToken(memberCreateResult.data.email);
    return sendMailerDto;
  }

  @MessagePattern(MEMBER_MESSAGE_PATTERNS.UPDATE)
  async updateMember(
    @Payload('id') id: string, @Payload('updateDto') updateDto: UpdateMemberDto
  ): Promise<IServiceResponse<MemberEntity>> {
    return await this.memberService.update(id, updateDto);
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

  @MessagePattern(MEMBER_MESSAGE_PATTERNS.VERIFY_ACCOUNT)
  async verifyEmail(
    @Payload('verifyUserDto') authVerifyUserDto: VerifyUserDto): Promise<IServiceResponse<UpdateResult>> {
    return this.memberService.verifyEmail(authVerifyUserDto)
  }

  @MessagePattern(MEMBER_MESSAGE_PATTERNS.RESEND_VERIFY)
  async sendEmailVerification(
    @Payload('emailVerifyTokenDto') emailVerifyTokenDto: EmailVerifyTokenDto): Promise<IServiceResponse<SendMailerDto>> {
    return this.memberService.createEmailToken(emailVerifyTokenDto.email)
  }

}
