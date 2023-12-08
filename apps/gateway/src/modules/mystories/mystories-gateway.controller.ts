import { ClientProxy } from "@nestjs/microservices";
import { Controller, Get, Inject, Logger, Param, ParseUUIDPipe, Patch, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { firstValueFrom } from "rxjs";
import { Auth, CurrentMember } from "@app/authentication";
import { MyStoriesSaga } from "../../../../mystories/src/my.stories.saga";
import { MY_STORIES_MESSAGE_PATTERNS } from "../../../../mystories/src/constant/mystories-patterns.constants";
import { IMyStoriesResponse } from "../../../../mystories/src/interface/my.stories.response";
import { MyStoryDto } from "../../../../mystories/src/dto/my.story.dto";
import { IServiceResponse, RabbitServiceName } from "@app/rabbit";

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

  constructor(
    @Inject(RabbitServiceName.MY_STORY) private myStoryClient: ClientProxy,
    private myStoriesSaga: MyStoriesSaga) { }

  @Get('/')
  @Auth()
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 200, description: 'Get my stories' })
  async getMyStories(
    @CurrentMember ('member_id') member_id: string
  ): Promise<IMyStoriesResponse<MyStoryDto[]>>{
    return await this.myStoriesSaga.getAllMyStories(member_id);
  };

  @Patch('/archived/:story_id')
  @Auth()
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 204, description: 'Update story status deleted / archived' })
  async archivedStory (
    @CurrentMember ('member_id') member_id: string,
    @Param('story_id', ParseUUIDPipe) story_id: string) : Promise<IServiceResponse<any>> {

    const { state, data } = await firstValueFrom(
      this.myStoryClient.send<IServiceResponse<any>, { member_id: string, story_id: string }>(
        MY_STORIES_MESSAGE_PATTERNS.ARCHIVED_STORY,
        {
          member_id,
          story_id
        }
      )
    );
    return { state, data };
  }

}
