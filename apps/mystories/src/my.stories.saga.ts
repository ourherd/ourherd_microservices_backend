import { Injectable, Logger } from "@nestjs/common";
import { MyStoriesService } from "./service/my.stories.service";
import { IMyStoriesResponse } from "./interface/my.stories.response";
import { MyStoryDto } from "./dto/my.story.dto";
import { isEmptyOrNull } from "@app/common/validation-rules/object-validation.rule";

@Injectable()
export class MyStoriesSaga {

  constructor(private myStoriesService: MyStoriesService) {}

  public async getAllMyStories(member_id: string): Promise<IMyStoriesResponse<MyStoryDto[]>> {

    const progress = await this.myStoriesService.getInProgressStories(member_id);
    const published = await this.myStoriesService.getPublishedStories(member_id);

    if (isEmptyOrNull(progress) && isEmptyOrNull(published)) {
      return {
        state: false,
        total_progress: isEmptyOrNull(progress)? 0 : progress.length,
        progress: null,
        published: null
      }
    }

    return {
      state: true,
      total_progress: isEmptyOrNull(progress)? 0 : progress.length,
      progress: progress,
      published: published
    }
  }

}
