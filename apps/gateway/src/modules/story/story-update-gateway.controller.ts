import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  Body,
  Controller,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";
import { Auth } from "@app/authentication";
import { IServiceResponse, RabbitServiceName } from "@app/rabbit";
import { ClientProxy } from "@nestjs/microservices";
import { FileInterceptor } from "@nestjs/platform-express";
import { IGatewayResponse } from "../../common/interface/gateway.interface";
import { STORY_MESSAGE_PATTERNS } from "apps/story/src/constant/story-patterns.constants";
import { StoryEntity } from "apps/story/src/entity/story/story.entity";
import { firstValueFrom } from "rxjs";
import { StoryUpdateTextFreeFormDto } from "apps/story/src/dto/story/story.update.text-freeform.dto";
import { StoryUpdateTextGuidedDto } from "apps/story/src/dto/story/story.update.text-guided.dto";
import { StoryUpdateVideoDto } from "apps/story/src/dto/story/story.update.video.dto";

@ApiTags('Story Update Gateway')
@Controller({
  path: '/story'
})
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
  }),
)

export class StoryUpdateGatewayController {

  constructor(
    @Inject(RabbitServiceName.STORY) private storyClient: ClientProxy,
  ) { }

  @Patch('/video/:story_id')
  @Auth()
  @ApiOperation({ summary: 'Story Update (Video Free Form)' })
  @ApiResponse({ status: 201, description: 'Create new Story as update (Video Free Form)' })
  @UseInterceptors(FileInterceptor('story_resource'))
  async updateVideo(
    @Body() updateVideoDto: StoryUpdateVideoDto,
    @Param('story_id', ParseUUIDPipe) story_id: string
  ): Promise<IGatewayResponse> {

    return await firstValueFrom(
      this.storyClient.send<IServiceResponse<StoryEntity>, { story_id: string, updateVideoDto: StoryUpdateVideoDto }>
        (
          STORY_MESSAGE_PATTERNS.UPDATE_VIDEO,
          {
            story_id,
            updateVideoDto
          }
        )
    );
  }

  @Patch('/text-guided/:story_id')
  @Auth()
  @ApiOperation({ summary: 'Story Update (Guided Text)' })
  @ApiResponse({ status: 201, description: 'Create new Story as update (Guided Text)' })
  async updateTextGuided(
    @Body() updateGuidedDto: StoryUpdateTextGuidedDto,
    @Param('story_id', ParseUUIDPipe) story_id: string
  )
    : Promise<IGatewayResponse> {
    const { state, data } = await firstValueFrom(
      this.storyClient.send<IServiceResponse<StoryEntity>,
        { story_id: string, updateGuidedDto: StoryUpdateTextGuidedDto }>
        (
          STORY_MESSAGE_PATTERNS.UPDATE_TEXT_GUIDE,
          {
            story_id,
            updateGuidedDto
          })
    );
    return { state, data };
  }

  @Patch('/text-freeform/:story_id')
  @Auth()
  @ApiOperation({ summary: 'Story Update (Free Form Text)' })
  @ApiResponse({ status: 201, description: 'Create new Story as update (Free Form Text) ' })
  async updateTextFreeForm(
    @Body() updateFreeFormDto: StoryUpdateTextFreeFormDto,
    @Param('story_id', ParseUUIDPipe) story_id: string
  )
    : Promise<IGatewayResponse> {
    const { state, data } = await firstValueFrom(
      this.storyClient.send<IServiceResponse<StoryEntity>,
        { story_id: string, updateFreeFormDto: StoryUpdateTextFreeFormDto }>
        (
          STORY_MESSAGE_PATTERNS.UPDATE_TEXT_FREE_FORM,
          {
            story_id,
            updateFreeFormDto
          }
        )
    );
    return { state, data };
  }

}
