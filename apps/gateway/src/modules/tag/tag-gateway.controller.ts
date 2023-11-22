import { Body, Controller, Get, Inject, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { IServiceResponse, RabbitServiceName } from "@app/rabbit";
import { firstValueFrom } from "rxjs";
import { ClientProxy } from "@nestjs/microservices";
import { CreateTagDto } from "../../../../tag/src/dto/create.tag.dto";
import { TagEntity } from "../../../../tag/src/entity/tag.entity";

import { IGatewayResponse } from "../../common/interface/gateway.interface";
import { Auth } from "@app/authentication";
import { TAG_MESSAGE_PATTERNS } from "../../../../tag/src/constant/tag-patterns.constants";
import { FindMemberDto } from "../../../../member/src/dto/find.member.dto";
import { IPagination } from "@app/common";
import { MemberEntity } from "../../../../member/src/entity/member.entity";
import { MEMBER_MESSAGE_PATTERNS } from "../../../../member/src/constant/member-patterns.constants";
import { AllTagsAppDto } from "../../../../tag/src/dto/all.tags.app.dto";

@ApiTags('Tags Gateway')
@Controller({
  path: '/tag'
})
export class TagGatewayController {

  constructor(@Inject(RabbitServiceName.TAG) private tagClient: ClientProxy) { }


  @Auth()
  @Get('/all')
  // async getMembers ( @Query() findDto: FindMemberDto ): Promise<IGatewayResponse<IPagination<MemberEntity>>> {
  async getTagsApp ( @Query() findDto: AllTagsAppDto ): Promise<IGatewayResponse<IPagination<TagEntity>>> {
    const { state, data } = await firstValueFrom(
      this.tagClient.send<IServiceResponse<IPagination<TagEntity>>>
      (
        TAG_MESSAGE_PATTERNS.ALL,
        findDto
      )
    );
    return { state, data };
  }


  @Post('/')
  @Auth()
  @ApiOperation({ summary: 'Tag Story' })
  @ApiResponse({ status: 201, description: 'Add a Tag story' })
  async create (
    @Body() tagDto: CreateTagDto,) : Promise<IGatewayResponse> {

    const { state, data, message } = await firstValueFrom(
      this.tagClient.send<IServiceResponse<TagEntity>,
        {
          tagDto: CreateTagDto }>
      (
        TAG_MESSAGE_PATTERNS.CREATE,
        {
            tagDto
        }
      )
    );
    return { state, data, message };
  };

}
