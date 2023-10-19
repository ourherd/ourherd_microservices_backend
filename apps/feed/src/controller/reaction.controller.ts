import { Controller, Logger } from "@nestjs/common";
import { ReactionService } from "../service/reaction.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { REACTION_MESSAGE_PATTERNS } from "../constant/reaction-patterns.constants";
import { PostReactionDto } from "../dto/post.reaction.dto";
import { IServiceResponse } from "@app/rabbit";
import { ReactionEntity } from "../entity/reaction.entity";

@Controller()
export class ReactionController {

  constructor(private readonly reactionService: ReactionService) {}
  logger = new Logger(ReactionService.name);

  @MessagePattern(REACTION_MESSAGE_PATTERNS.REACT)
  async reaction (
    @Payload('reactDto') reactDto: PostReactionDto): Promise<IServiceResponse<ReactionEntity>> {
    this.logger.log('REACTION_MESSAGE_PATTERNS.REACT ' + reactDto.story_id);
    return await this.reactionService.reactToStory(reactDto);
  }
}
