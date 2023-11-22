import { Controller } from "@nestjs/common";
import { MemberService } from "../service/member.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { MEMBER_EVENT_PATTERNS, MEMBER_MESSAGE_PATTERNS } from "../constant/member-patterns.constants";
import { MemberEntity } from "../entity/member.entity";
import { CreateMemberDto } from "../dto/create-member.dto";
import { UpdateMemberDto } from "../dto/update-member.dto";
import { IServiceResponse } from "@app/rabbit";
import { IPagination, PaginationDto } from "@app/common";

@Controller()
export class MemberController {
  constructor(
    private readonly memberService: MemberService,
  ) {}

  @MessagePattern(MEMBER_EVENT_PATTERNS.CREATED)
  async createMember(
    @Payload('createDto') createDto: CreateMemberDto) {
    await this.memberService.create(createDto);
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
  async getMembers(@Payload() paginationDto: PaginationDto): Promise<IServiceResponse<IPagination<MemberEntity>>> {
    return await this.memberService.findAll(paginationDto);
  }

  // Only admin
  @MessagePattern(MEMBER_MESSAGE_PATTERNS.GET_MY_PROFILE)
  async getMemberById(@Payload('member_id') id: string): Promise<IServiceResponse<MemberEntity>> {
    return await this.memberService.findById(id);
  }

}
