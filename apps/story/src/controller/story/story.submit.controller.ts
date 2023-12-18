import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { STORY_MESSAGE_PATTERNS } from "../../constant/story-patterns.constants";
import { IServiceResponse } from "@app/rabbit";
import { StoryEntity } from "../../entity/story/story.entity";
import { StorySubmitService } from "../../service/story/story.submit.service";

@Controller()
export class StorySubmitController {
  constructor(private readonly storySubmitService: StorySubmitService) {}

  @MessagePattern(STORY_MESSAGE_PATTERNS.SUBMIT_STORY)
  async submit (
    @Payload('member_id') member_id: string,
    @Payload('story_id') story_id: string):
    Promise<IServiceResponse<StoryEntity>> {

    return await this.storySubmitService.submit( member_id, story_id );
  }
}
