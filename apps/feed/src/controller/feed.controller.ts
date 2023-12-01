import { Controller, Logger } from "@nestjs/common";
import { FeedService } from "../service/feed.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { IServiceResponse } from "@app/rabbit";
import { FEED_MESSAGE_PATTERNS } from "../constant/feed-patterns.constants";
import { StoryEntity } from "../../../story/src/entity/story/story.entity";

@Controller()
export class FeedController {

  constructor(private readonly feedService: FeedService) {}

  logger = new Logger(FeedController.name);

  // @MessagePattern(FEED_MESSAGE_PATTERNS.FEED_ALL)
  // async save (
  //   @Payload('member_id') member_id: string):
  //   Promise<IServiceResponse<StoryEntity>> {
  //
  //   return await this.feedService.getFeed();
  // }

}
