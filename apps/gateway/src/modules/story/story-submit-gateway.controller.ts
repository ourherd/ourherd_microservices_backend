import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Controller, Inject, Param, ParseUUIDPipe, Patch, UsePipes, ValidationPipe } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { IServiceResponse, RabbitServiceName } from "@app/rabbit";
import { firstValueFrom } from "rxjs";
import { Auth, CurrentMember } from "@app/authentication";
import { IGatewayResponse } from "../../common/interface/gateway.interface";
import { StoryEntity } from "../../../../story/src/entity/story/story.entity";
import { STORY_MESSAGE_PATTERNS } from "../../../../story/src/constant/story-patterns.constants";

@ApiTags('Story Submit Update Gateway')
@Controller({
  path: '/story/submit'
})

@UsePipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
  }),
)

export class StorySubmitGatewayController {

  constructor(
    @Inject(RabbitServiceName.STORY) private storyClient: ClientProxy,
  ) { }

  @Patch('/:story_id')
  @Auth()
  @ApiOperation({ summary: 'Story Submit' })
  @ApiResponse({ status: 201, description: 'Submit story' })
  async submit(
    @CurrentMember('member_id') member_id: string,
    @Param('story_id', ParseUUIDPipe) story_id: string,
  ): Promise<IGatewayResponse> {

    const { state, data, message } = await firstValueFrom(
      this.storyClient.send<IServiceResponse<StoryEntity>,
        { member_id: string, story_id: string }>
      (
        STORY_MESSAGE_PATTERNS.SUBMIT_STORY,
        {
          member_id,
          story_id,
        }
      )
    );
    return { state, data, message };
  }

}
