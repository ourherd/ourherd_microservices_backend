import { Controller, Logger } from "@nestjs/common";
import { StoryBookmarkService } from "../service/story.bookmark.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { BOOKMARK_MESSAGE_PATTERNS } from "../constant/story-patterns.constants";
import { PostStoryBookmarkDto } from "../dto/bookmark/post.story.bookmark.dto";
import { StoryBookmarkEntity } from "../entity/story.bookmark.entity";
import { IServiceResponse } from "@app/rabbit";


@Controller()
export class StoryBookmarkController {

  constructor(private readonly bookmarkService: StoryBookmarkService) {}

  logger = new Logger(StoryBookmarkController.name);

  @MessagePattern(BOOKMARK_MESSAGE_PATTERNS.SAVE_BOOKMARK)
  async save (
    @Payload('member_id') member_id: string,
    @Payload('bookmarkDto') bookmarkDto: PostStoryBookmarkDto):
    Promise<IServiceResponse<StoryBookmarkEntity>> {

    return await this.bookmarkService.save(member_id, bookmarkDto);
  }

}
