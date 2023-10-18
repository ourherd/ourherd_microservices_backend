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

@Controller()
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @MessagePattern(MEMBER_MESSAGE_PATTERNS.CREATE)
  async createMember(
    @Payload('createDto') createDto: CreateMemberDto): Promise<IServiceResponse<MemberEntity>> {
    return await this.memberService.create(createDto);
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

}
