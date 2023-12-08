import { Controller, Get, Logger, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { MyStoriesSaga } from "../../../../mystories/src/my.stories.saga";
import { Auth, CurrentMember } from "@app/authentication";
import { IMyStoriesResponse } from "../../../../mystories/src/interface/my.stories.response";
import { MyStoryDto } from "../../../../mystories/src/dto/my.story.dto";

@ApiTags('My Stories Gateway')
@Controller({
  path: '/my-stories'
})

@UsePipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
  }),
)

export class MyStoriesGatewayController {

  private readonly logger = new Logger(MyStoriesGatewayController.name);

  constructor(private myStoriesSaga: MyStoriesSaga){}

  @Get('/')
  @Auth()
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 200, description: 'Get my stories' })
  async getMyStories(
    @CurrentMember ('member_id') member_id: string
  ): Promise<IMyStoriesResponse<MyStoryDto[]>>{
    return await this.myStoriesSaga.getAllMyStories(member_id);
  };

}
