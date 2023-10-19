import { Controller, Get } from '@nestjs/common';
import { FeedService } from './feed.service';
import { MessagePattern, Payload } from "@nestjs/microservices";
import { REACTION_MESSAGE_PATTERNS } from "./constant/reaction-patterns.constants";

import { PostReactionDto } from "./dto/post.reaction.dto";

import { IServiceResponse } from "@app/rabbit";
import { ReactionEntity } from "./entity/reaction.entity";

@Controller()
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @MessagePattern(REACTION_MESSAGE_PATTERNS.REACT)
  async createMember(
    @Payload('postReactionDto') postReactionDto: PostReactionDto): Promise<IServiceResponse<ReactionEntity>> {
    return await this.feedService.reactToStory();
  }
}
