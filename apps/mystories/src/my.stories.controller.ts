import { Controller } from "@nestjs/common";
import { MyStoriesService } from "./service/my.stories.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { IServiceResponse } from "@app/rabbit";
import { MY_STORIES_MESSAGE_PATTERNS } from "./constant/mystories-patterns.constants";

@Controller()
export class MyStoriesController {

  constructor(private readonly myStoriesService: MyStoriesService) {}

  @MessagePattern(MY_STORIES_MESSAGE_PATTERNS.ARCHIVED_STORY)
  async archived(
    @Payload('member_id') member_id: string,
    @Payload('story_id') story_id: string
  ): Promise<IServiceResponse<any>> {

    const survey = this.myStoriesService.archivedStory(
      member_id,
      story_id
    );
    return survey;
  }
}
