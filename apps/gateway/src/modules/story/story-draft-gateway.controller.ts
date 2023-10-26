import { ApiTags } from "@nestjs/swagger";
import { Body, Controller, Inject, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { IServiceResponse, RabbitServiceName } from "@app/rabbit";
import { ClientProxy } from "@nestjs/microservices";
import { IGatewayResponse } from "../../common/interface/gateway.interface";
import { firstValueFrom } from "rxjs";
import { STORY_MESSAGE_PATTERNS } from "../../../../story/src/constant/story-patterns.constants";

import { StoryDraftVideoDto } from "../../../../story/src/dto/story.draft.video.dto";
import { StoryDraftTextFreeformDto } from "../../../../story/src/dto/story.draft.text-freeform.dto";
import { StoryDraftTextGuidedDto } from "../../../../story/src/dto/story.draft.text-guided.dto";
import { StoryEntity } from "../../../../story/src/entity/story.entity";


@ApiTags('Story Draft Module')
@Controller({
  path: '/story/draft'
})

export class StoryDraftGatewayController {

  constructor(@Inject(RabbitServiceName.STORY) private storyDraftClient: ClientProxy) { }

  @Post('/video')
  async draftVideo ( draftVideodDto: StoryDraftVideoDto ) {

  }

  @Post('/text-guided')
  @UsePipes(new ValidationPipe({ transform: true }))
  async draftImageGuided ( @Body() draftGuidedDto: StoryDraftTextGuidedDto )  : Promise<IGatewayResponse>  {

    const { state, data } = await firstValueFrom(
      this.storyDraftClient.send<IServiceResponse<StoryEntity>, { draftGuidedDto: StoryDraftTextGuidedDto }>
      (
       STORY_MESSAGE_PATTERNS.DRAFT_TEXT_GUIDE,
        {
          draftGuidedDto
        }
      )
    );

    return { state, data };
  }

  @Post('/text-freeform')
  @UsePipes(new ValidationPipe({ transform: true }))
  async draftImageFreeForm ( @Body() draftFreeFormDto: StoryDraftTextFreeformDto ) : Promise<IGatewayResponse>  {

    const { state, data } = await firstValueFrom(
      this.storyDraftClient.send<IServiceResponse<StoryEntity>, { draftFreeFormDto: StoryDraftTextFreeformDto }>
      (
        STORY_MESSAGE_PATTERNS.DRAFT_TEXT_FREE_FORM,
        {
          draftFreeFormDto
        }
      )
    );
    return { state, data };

  }

}
