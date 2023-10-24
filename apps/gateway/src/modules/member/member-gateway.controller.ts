import { Body, Controller, Get, Inject, Logger, Param, ParseUUIDPipe, Patch, Post, Query } from "@nestjs/common";
import { IGatewayResponse } from "../../common/interface/gateway.interface";
import { IServiceResponse, RabbitServiceName } from "@app/rabbit";
import { IPagination } from "@app/common";
import { MemberEntity } from "apps/member/src/entity/member.entity";
import { FindMemberDto } from "apps/member/src/dto/find.member.dto";
import { ApiTags } from "@nestjs/swagger";
import { firstValueFrom } from "rxjs";
import { MEMBER_MESSAGE_PATTERNS, MEMBER_SERVICE } from "../../../../member/src/constant/member-patterns.constants";
import { ClientProxy } from "@nestjs/microservices";
import { CreateMemberDto } from "../../../../member/src/dto/create-member.dto";
import { UpdateMemberDto } from "../../../../member/src/dto/update-member.dto";

@ApiTags('Member Gateway')
@Controller({
  path: '/member'
})

export class MemberGatewayController {

  logger = new Logger(MEMBER_SERVICE);
  constructor(@Inject(RabbitServiceName.MEMBER) private memberClient: ClientProxy) { }

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

  @Post('/')
  async createProfile ( @Body() createDto: CreateMemberDto) : Promise<IGatewayResponse> {

    const { state, data } = await firstValueFrom(
      this.memberClient.send<IServiceResponse<MemberEntity>, { createDto: CreateMemberDto }>
      (
        MEMBER_MESSAGE_PATTERNS.CREATE,
        {
          createDto
        }
      )
    );
    return { state, data };
  };

  @Patch('/:id')
  async updateProfile(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateMemberDto
  ) : Promise<IGatewayResponse> {

    const { state, data } = await firstValueFrom(
      this.memberClient.send<IServiceResponse<MemberEntity>, { id: string, updateDto: UpdateMemberDto }>(
        MEMBER_MESSAGE_PATTERNS.UPDATE,
        {
          id,
          updateDto
        }
      )
    );

    return { state, data };
  }

}
