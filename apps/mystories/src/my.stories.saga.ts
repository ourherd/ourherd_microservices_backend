import { Injectable, Logger } from "@nestjs/common";
import { MyStoriesService } from "./service/my.stories.service";
import { IMyStoriesResponse } from "./interface/my.stories.response";
import { MyStoryDto } from "./dto/my.story.dto";

@Injectable()
export class MyStoriesSaga {

  constructor(private myStoriesService: MyStoriesService) {}

  public async getAllMyStories(member_id: string): Promise<IMyStoriesResponse<MyStoryDto[]>> {

    const progress = await this.myStoriesService.getInProgressStories(member_id);
    const published = await this.myStoriesService.getPublishedStories(member_id);

    return {
      state: true,
      progress: progress,
      published: published
    }
  }

}
