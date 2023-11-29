import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Inject, Param, ParseUUIDPipe, Patch, UsePipes, ValidationPipe } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { IServiceResponse, RabbitServiceName } from "@app/rabbit";
import { firstValueFrom } from "rxjs";
import { Auth } from "@app/authentication";
import { StoryUpdateSettingDto } from "../../../../story/src/dto/story/story.update.setting.dto";
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
    @Param('story_id', ParseUUIDPipe) story_id: string,
  )
    : Promise<IGatewayResponse> {
    const { state, data } = await firstValueFrom(
      this.storyClient.send<IServiceResponse<StoryEntity>,
        { story_id: string, updateSettingDto: StoryUpdateSettingDto }>
      (
        STORY_MESSAGE_PATTERNS.UPDATE_SETTING,
        {
          story_id,
          updateSettingDto
        }
      )
    );
    return { state, data };
  }

}
