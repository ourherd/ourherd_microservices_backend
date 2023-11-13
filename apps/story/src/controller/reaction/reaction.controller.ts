import { Controller, Logger } from "@nestjs/common";
import { ReactionService } from "../../service/reaction.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { REACTION_MESSAGE_PATTERNS } from "../../constant/reaction-patterns.constants";
import { PostReactionDto } from "../../dto/reaction/post.reaction.dto";
import { IServiceResponse } from "@app/rabbit";
import { ReactionEntity } from "../../entity/reaction/reaction.entity";

@Controller()
export class ReactionController {

  constructor(private readonly reactionService: ReactionService) {}
  logger = new Logger(ReactionController.name);

  @MessagePattern(REACTION_MESSAGE_PATTERNS.REACT)
  async reaction (
    @Payload('member_id') member_id: string,
    @Payload('reactionDto') reactionDto: PostReactionDto): Promise<IServiceResponse<ReactionEntity>> {
    return await this.reactionService.reactionToStory(member_id, reactionDto);
  }
}