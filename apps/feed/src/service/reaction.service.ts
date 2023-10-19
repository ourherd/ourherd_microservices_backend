import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ReactionEntity } from "../entity/reaction.entity";
import { Database } from "@app/database";
import { Repository } from "typeorm";
import { PostReactionDto } from "../dto/post.reaction.dto";
import { IServiceResponse } from "@app/rabbit";
import { REACTION_MESSAGE_DB_RESPONSE } from "../constant/reaction-patterns.constants";

@Injectable()
export class ReactionService {
  // private readonly logger = new Logger(ReactionService.name)
  constructor(
    @InjectRepository(ReactionEntity, Database.PRIMARY)  private reactionRepository: Repository<ReactionEntity>
  ) {}

  async reactToStory(reactDto: PostReactionDto): Promise<IServiceResponse<ReactionEntity>> {
    const reaction = await this.reactionRepository.findOneBy(
      {
        member_id: reactDto.member_id,
        story_id: reactDto.story_id
      }
    );
    return {
      state: true,
      data: reaction,
      message: !!reaction ? REACTION_MESSAGE_DB_RESPONSE.CREATED : REACTION_MESSAGE_DB_RESPONSE.CREATED_FAILED
    }

  }

}
