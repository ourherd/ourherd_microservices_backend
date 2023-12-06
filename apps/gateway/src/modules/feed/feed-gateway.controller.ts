import { Body, Controller, Get, Logger, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
// import { RabbitServiceName } from "@app/rabbit";
// import { ClientProxy } from "@nestjs/microservices";
import { FeedService } from "../../../../feed/src/service/feed.service";
import { Auth, CurrentMember } from "@app/authentication";
import { Payload } from "@nestjs/microservices";
import { StoriesListDto } from "../../../../feed/src/dto/stories.list.dto";
import { StoryDto } from "../../../../feed/src/dto/story.dto";
import { IFeedResponse } from "../../../../feed/src/interface/feed.response";
import { IFeedPaginationInterface } from "../../../../feed/src/interface/feed.pagination.interface";
import { FiltersDto } from "../../../../feed/src/dto/filters.dto";
import { StoryUpdateVideoDto } from "../../../../story/src/dto/story/story.update.video.dto";

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

  private readonly logger = new Logger(FeedGatewayController.name);

  constructor(private feedService: FeedService){}

  @Get('/')
  @Auth()
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 200, description: 'Get Feed' })
  async feed(
    @CurrentMember ('member_id') member_id: string,
    @Query() listDto: StoriesListDto,
    @Body() filtersDto: FiltersDto ):
    Promise<IFeedResponse<IFeedPaginationInterface<StoryDto>>> {

    return await this.feedService.getFeed(member_id, listDto, filtersDto);
  };

}
