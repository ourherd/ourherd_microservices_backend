import { Controller, Get, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { IGatewayResponse } from "../../common/interface/gateway.interface";
// import { RabbitServiceName } from "@app/rabbit";
// import { ClientProxy } from "@nestjs/microservices";
import { FeedService } from "../../../../feed/src/service/feed.service";
import { StoryEntity } from "../../../../story/src/entity/story/story.entity";
import { Auth } from "@app/authentication";
import { FeedDto } from "../../../../feed/src/dto/feed.dto";
import { Payload } from "@nestjs/microservices";
import { IPagination, PaginationDto } from "@app/common";
import { FindMemberDto } from "../../../../member/src/dto/find.member.dto";
import { StoriesListDto } from "../../../../feed/src/dto/stories.list.dto";

@ApiTags('Feed Gateway')
@Controller({
  path: '/feed'
})

@UsePipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
  }),
)
export class FeedGatewayController {

  constructor(private feedService: FeedService){}

  @Get('/')
  @Auth()
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 200, description: '' })
  async feed(  @Payload('member_id') member_id: string,
               @Query() listDto: StoriesListDto ):
                      Promise<IGatewayResponse<IPagination<StoryEntity>>> {

    const stories = await this.feedService.getFeed(member_id, listDto);
    return stories;

  };

}
