import { Body, Controller, Get, Inject, Logger, Patch, Query } from "@nestjs/common";
import { IGatewayResponse } from "../../common/interface/gateway.interface";
import { IServiceResponse, RabbitServiceName } from "@app/rabbit";
import { IPagination } from "@app/common";
import { MemberEntity } from "apps/member/src/entity/member.entity";
import { FindMemberDto } from "apps/member/src/dto/find.member.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { firstValueFrom } from "rxjs";
import { MEMBER_MESSAGE_PATTERNS, MEMBER_SERVICE } from "../../../../member/src/constant/member-patterns.constants";
import { ClientProxy } from "@nestjs/microservices";
import { UpdateMemberDto } from "../../../../member/src/dto/update-member.dto";
import { CurrentMember } from "@app/authentication/decorator/member.decorator";
import { Auth } from "@app/authentication";

@ApiTags('Member Gateway')
@Controller({
  path: '/member'
})

export class MemberGatewayController {

  logger = new Logger(MEMBER_SERVICE);
  constructor(
    @Inject(RabbitServiceName.MEMBER) private memberClient: ClientProxy,
    @Inject(RabbitServiceName.EMAIL) private emailClient: ClientProxy
  ) { }

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

  @Patch('/')
  @Auth()
  @ApiOperation({ summary: 'Update Profile' })
  @ApiResponse({ status: 204, description: "Update first name, birthday, etc" })
  async updateProfile(
    @CurrentMember ('id_member') id: string,
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
