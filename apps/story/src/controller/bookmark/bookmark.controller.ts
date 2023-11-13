import { Controller, Logger } from "@nestjs/common";
import { BookmarkService } from "../../service/bookmark.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { BOOKMARK_MESSAGE_PATTERNS } from "../../constant/story-patterns.constants";
import { PostStoryBookmarkDto } from "../../dto/bookmark/post.story.bookmark.dto";
import { BookmarkEntity } from "../../entity/bookmark/bookmark.entity";
import { IServiceResponse } from "@app/rabbit";


@Controller()
export class BookmarkController {

  constructor(private readonly bookmarkService: BookmarkService) {}

  logger = new Logger(BookmarkController.name);

  @MessagePattern(BOOKMARK_MESSAGE_PATTERNS.SAVE_BOOKMARK)
  async save (
    @Payload('member_id') member_id: string,
    @Payload('bookmarkDto') bookmarkDto: PostStoryBookmarkDto):
    Promise<IServiceResponse<BookmarkEntity>> {

    return await this.bookmarkService.save(member_id, bookmarkDto);
  }

}
