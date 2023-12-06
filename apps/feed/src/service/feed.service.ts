import { Injectable, Logger } from "@nestjs/common";
import { StoriesListDto } from "../dto/stories.list.dto";
import { IFeedResponse } from "../interface/feed.response";
import { IFeedPaginationInterface } from "../interface/feed.pagination.interface";
import { StoryDto } from "../dto/story.dto";
import { StoryService } from "./story.service";


@Injectable()
export class FeedService {

  private readonly logger = new Logger(FeedService.name);
  private FEED_LIMIT = 10;

  constructor(private storiesService: StoryService) {}

  async getFeed(member_id: string, { page }: StoriesListDto):
    Promise<IFeedResponse<IFeedPaginationInterface<StoryDto>>> {

    const { stories: feed, total: totalFeed } = await this.storiesService.getFeedStories(member_id, page);
    const { stories: saved, total: totalSaved } = await this.storiesService.getSavedStories(member_id, page);

    return {
      state: true,
      feed: {
        stories: feed,
        limit: this.FEED_LIMIT,
        page: page,
        total: totalFeed
      },
      saved: {
        stories: saved,
        limit: this.FEED_LIMIT,
        page: page,
        total: totalSaved
      }
    };
  }
}
