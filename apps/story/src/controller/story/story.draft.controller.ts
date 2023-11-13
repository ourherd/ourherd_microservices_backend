import { Controller } from "@nestjs/common";
import { StoryDraftService } from "../../service/story.draft.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { STORY_MESSAGE_PATTERNS } from "../../constant/story-patterns.constants";
import { IServiceResponse } from "@app/rabbit";
import { StoryDraftTextFreeformDto } from "../../dto/story/story.draft.text-freeform.dto";
import { StoryEntity } from "../../entity/story/story.entity";
import { StoryDraftTextGuidedDto } from "../../dto/story/story.draft.text-guided.dto";
import { StoryDraftVideoDto } from "../../dto/story/story.draft.video.dto";

@Controller()
export class StoryDraftController {

  constructor(private readonly draftService: StoryDraftService) {}

  @MessagePattern(STORY_MESSAGE_PATTERNS.DRAFT_VIDEO)
  async draftVideo (
    @Payload('member_id') member_id: string,
    @Payload('draftVideoDto') draftVideoDto: StoryDraftVideoDto):
    Promise<IServiceResponse<StoryEntity>> {
    return await this.draftService.saveStory( member_id, draftVideoDto );
  }

  @MessagePattern(STORY_MESSAGE_PATTERNS.DRAFT_TEXT_GUIDE)
  async draftTextGuide (
    @Payload('member_id') member_id: string,
    @Payload('draftGuidedDto') draftGuidedDto: StoryDraftTextGuidedDto):
    Promise<IServiceResponse<StoryEntity>> {

    return await this.draftService.saveStory( member_id, draftGuidedDto );
  }

  @MessagePattern(STORY_MESSAGE_PATTERNS.DRAFT_TEXT_FREE_FORM)
  async draftFreeForm (
    @Payload('member_id') member_id: string,
    @Payload('draftFreeFormDto') draftFreeFormDto: StoryDraftTextFreeformDto):
    Promise<IServiceResponse<StoryEntity>> {

    return await this.draftService.saveStory( member_id, draftFreeFormDto );
  }


}
