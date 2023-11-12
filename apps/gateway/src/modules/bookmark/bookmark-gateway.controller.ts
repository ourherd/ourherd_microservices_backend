import { ApiTags } from "@nestjs/swagger";
import { Body, Controller, Inject, Post } from "@nestjs/common";
import { IServiceResponse, RabbitServiceName } from "@app/rabbit";
import { ClientProxy } from "@nestjs/microservices";
import { PostStoryBookmarkDto } from "../../../../story/src/dto/bookmark/post.story.bookmark.dto";
import { IGatewayResponse } from "../../common/interface/gateway.interface";
import { firstValueFrom } from "rxjs";
import { BookmarkEntity } from "../../../../story/src/entity/bookmark/bookmark.entity";
import { BOOKMARK_MESSAGE_PATTERNS } from "../../../../story/src/constant/story-patterns.constants";
import { Auth, CurrentMember } from "@app/authentication";

@ApiTags('Story Bookmark Gateway')
@Controller({
  path: '/story/bookmark'
})
export class StoryBookmarkGatewayController {

  constructor(@Inject(RabbitServiceName.STORY) private storyBookmarkClient: ClientProxy) { }

  @Post('/')
  @Auth()
  async save (
    @CurrentMember('member_id') member_id: string,
    @Body() bookmarkDto: PostStoryBookmarkDto) : Promise<IGatewayResponse> {
    const { state, data } = await firstValueFrom(
      this.storyBookmarkClient.send<IServiceResponse<BookmarkEntity|null>,
        { member_id: string, bookmarkDto: PostStoryBookmarkDto }>
      (
        BOOKMARK_MESSAGE_PATTERNS.SAVE_BOOKMARK,
        {
          member_id,
          bookmarkDto
        }
      )
    );
    return { state, data };
  }

}
