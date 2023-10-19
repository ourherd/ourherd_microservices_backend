import { Body, Controller, Get, Inject, Post, Query } from "@nestjs/common";
import { IGatewayResponse } from '../../common/interface/gateway.interface';
import { IServiceResponse, RabbitServiceName } from "@app/rabbit";
import { IPagination, PaginationDto } from '@app/common';
import { MemberEntity } from 'apps/member/src/entity/member.entity';
import { FindMemberDto } from "apps/member/src/dto/find.member.dto";
import { Auth, CurrentUser } from "@app/authentication";
import { ApiTags } from "@nestjs/swagger";
import { firstValueFrom } from "rxjs";
import { MEMBER_MESSAGE_PATTERNS } from "../../../../member/src/constant/member-patterns.constants";
import { ClientProxy } from "@nestjs/microservices";

@ApiTags('User Gateway')
@Controller({
  path: '/member'
})

// @Auth()
export class MemberGatewayController {

  constructor(
    @Inject(RabbitServiceName.MEMBER) private memberClient: ClientProxy)
  { }

  @Auth()
  // @Roles(Role.MEMBER)
  @Get('/me')
  async getSelf() {
    return {
      state: true,
      data: 'member'
    };
  }

  @Get('/')
  async getMembers ( @Query() findDto: FindMemberDto ): Promise<IGatewayResponse<IPagination<MemberEntity>>> {
    const { state, data } = await firstValueFrom(
      this.memberClient.send<IServiceResponse<IPagination<MemberEntity>>>
      (
        MEMBER_MESSAGE_PATTERNS.FIND_ALL,
        findDto
      )
    );
    return { state, data };
  }




}
