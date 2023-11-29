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
import { IPagination } from "@app/common";
import { AllTagsAppDto } from "../../../../tag/src/dto/all.tags.app.dto";

@ApiTags('Tags Gateway')
@Controller({
  path: '/tag'
})
export class TagGatewayController {

  constructor(@Inject(RabbitServiceName.TAG) private tagClient: ClientProxy) { }

  @Get('/app')
  async getTagsApp ( @Query() findDto: AllTagsAppDto ): Promise<IGatewayResponse<IPagination<TagEntity>>> {
    const { state, data } = await firstValueFrom(
      this.tagClient.send<IServiceResponse<IPagination<TagEntity>>>
      (
        TAG_MESSAGE_PATTERNS.APP,
        findDto
      )
    );
    return { state, data };
  }


  @Post('/')
  @Auth()
  @ApiOperation({ summary: 'Tag Story' })
  @ApiResponse({ status: 201, description: 'Add a Tag story' })
  async create (@Body() tagDto: CreateTagDto,) : Promise<IGatewayResponse> {

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
