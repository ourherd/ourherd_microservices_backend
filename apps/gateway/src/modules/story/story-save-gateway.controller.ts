import { ApiTags } from "@nestjs/swagger";
import { Body, Controller, Inject, Post } from "@nestjs/common";
import { IServiceResponse, RabbitServiceName } from "@app/rabbit";
import { ClientProxy } from "@nestjs/microservices";
import { PostStoryBookmarkDto } from "../../../../story/src/dto/post.story.bookmark.dto";
import { IGatewayResponse } from "../../common/interface/gateway.interface";
import { firstValueFrom } from "rxjs";
import { StoryBookmarkEntity } from "../../../../story/src/entity/story.bookmark.entity";
import { BOOKMARK_MESSAGE_PATTERNS } from "../../../../story/src/constant/story-patterns.constants";

@ApiTags('Story Bookmark Module')
@Controller({
  path: '/bookmark'
})

export class StorySaveGatewayController {

  constructor(@Inject(RabbitServiceName.STORY) private storySaveClient: ClientProxy) { }

  @Post('/')
  async save ( @Body() bookmarkDto: PostStoryBookmarkDto,) : Promise<IGatewayResponse> {
    const { state, data } = await firstValueFrom(
      this.storySaveClient.send<IServiceResponse<StoryBookmarkEntity|null>, { bookmarkDto: PostStoryBookmarkDto }>
      (
        BOOKMARK_MESSAGE_PATTERNS.SAVE_BOOKMARK,
        {
          bookmarkDto
        }
      )
    );
    return { state, data };
  }

}
