import { Controller } from "@nestjs/common";
import { StoryDraftService } from "../service/story.draft.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { STORY_MESSAGE_PATTERNS } from "../constant/story-patterns.constants";
import { IServiceResponse } from "@app/rabbit";
import { StoryDraftTextFreeformDto } from "../dto/story.draft.text-freeform.dto";
import { StoryEntity } from "../entity/story.entity";
import { StoryDraftTextGuidedDto } from "../dto/story.draft.text-guided.dto";
import { StoryDraftVideoDto } from "../dto/story.draft.video.dto";

@Controller()
export class StoryDraftController {

  constructor(private readonly draftService: StoryDraftService) {}

  @MessagePattern(STORY_MESSAGE_PATTERNS.DRAFT_VIDEO)
  async draftVideo (
    @Payload('draftDto') draftVideoDto: StoryDraftVideoDto):
    Promise<IServiceResponse<StoryEntity>> {
    return await this.draftService.draftVideo(draftVideoDto);
  }

  @MessagePattern(STORY_MESSAGE_PATTERNS.DRAFT_TEXT_GUIDE)
  async draftImageGuide (
    @Payload('draftGuidedDto') draftGuidedDto: StoryDraftTextGuidedDto):
    Promise<IServiceResponse<StoryEntity>> {

    return await this.draftService.draftGuided(draftGuidedDto);
  }

  @MessagePattern(STORY_MESSAGE_PATTERNS.DRAFT_TEXT_FREE_FORM)
  async draftFreeForm (
    @Payload('draftFreeFormDto') draftFreeFormDto: StoryDraftTextFreeformDto):
    Promise<IServiceResponse<StoryEntity>> {

    return await this.draftService.draftFreeForm( draftFreeFormDto );
  }


}
