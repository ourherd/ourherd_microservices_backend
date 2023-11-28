import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Inject, Param, ParseUUIDPipe, Patch, UsePipes, ValidationPipe } from "@nestjs/common";
import { Auth } from "@app/authentication";
import { StoryUpdateSettingDto } from "../../../../story/src/dto/story/story.update.setting.dto";
import { IGatewayResponse } from "../../common/interface/gateway.interface";
import { firstValueFrom } from "rxjs";
import { IServiceResponse, RabbitServiceName } from "@app/rabbit";
import { StoryEntity } from "../../../../story/src/entity/story/story.entity";
import { STORY_MESSAGE_PATTERNS } from "../../../../story/src/constant/story-patterns.constants";
import { ClientProxy } from "@nestjs/microservices";

@ApiTags('Story Settings Update Gateway')
@Controller({
  path: '/story/setting'
})
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
  }),
)

export class StorySettingsGatewayController {

  constructor(
    @Inject(RabbitServiceName.STORY) private storyClient: ClientProxy,
  ) { }

  @Patch('/:story_id')
  @Auth()
  @ApiOperation({ summary: 'Story Update (Free Form Text)' })
  @ApiResponse({ status: 201, description: 'Create new Story as update (Free Form Text) ' })
  async updateSetting(
    @Param('story_id', ParseUUIDPipe) story_id: string,
    @Body() updateSettingDto: StoryUpdateSettingDto
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
