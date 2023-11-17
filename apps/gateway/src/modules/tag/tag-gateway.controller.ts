import { Body, Controller, Inject, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { IServiceResponse, RabbitServiceName } from "@app/rabbit";
import { firstValueFrom } from "rxjs";
import { ClientProxy } from "@nestjs/microservices";
import { CreateTagDto } from "../../../../tag/src/dto/create.tag.dto";
import { TagEntity } from "../../../../tag/src/entity/tag.entity";

import { IGatewayResponse } from "../../common/interface/gateway.interface";
import { Auth } from "@app/authentication";
import { TAG_MESSAGE_PATTERNS } from "../../../../tag/src/constant/tag-patterns.constants";

@ApiTags('Tags Gateway')
@Controller({
  path: '/tag'
})
export class TagGatewayController {

  constructor(@Inject(RabbitServiceName.TAG) private tagClient: ClientProxy) { }

  @Post('/')
  @Auth()
  @ApiOperation({ summary: 'Tag Story' })
  @ApiResponse({ status: 201, description: 'Add a Tag story' })
  async createTag (
    @Body() tagDto: CreateTagDto,) : Promise<IGatewayResponse> {

    console.log(JSON.stringify(tagDto));
    const { state, data } = await firstValueFrom(
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
    return { state, data };
  };

}
