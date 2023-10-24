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
  private readonly logger = new Logger(ReactionService.name)
  constructor(
    @InjectRepository(ReactionEntity, Database.PRIMARY)  private reactionRepository: Repository<ReactionEntity >) {}

  async reactionToStory(reactionDto: PostReactionDto): Promise<IServiceResponse<ReactionEntity>> {
    this.logger.log('Reaction Post --> ' + JSON.stringify(reactionDto));
    return await this.checkStoryWithReaction( reactionDto );
  }

  async checkStoryWithReaction( reactionDto: PostReactionDto ): Promise<IServiceResponse<ReactionEntity>> {

    const reaction = await this.reactionRepository.findOne(
      {
        where: {
          member_id: reactionDto.member_id,
          story_id: reactionDto.story_id
        },
      }
    );
    // TODO This won't work with multiples reactions CLAP | SMILE | LOVE
    if ( reaction === null ) {
      this.logger.log ('Create reaction on story --> '+ reactionDto.story_id );
      this.logger.log ('Create reaction on story tyoe --> '+ reactionDto.reaction_type );
      return await this.createReaction( reactionDto );
    }
    this.logger.log ('Remove reaction on story --> '+ reactionDto.story_id );
    return await this.reactionRepository.remove( reaction );

  }

  async createReaction ( reactionDto: PostReactionDto ): Promise<IServiceResponse<ReactionEntity>> {

    const reaction = await this.reactionRepository.create(reactionDto);
    const result = await this.reactionRepository.save(reaction);
    return {
      state: !!result,
      data: result,
      message: !!result ? REACTION_MESSAGE_DB_RESPONSE.CREATED : REACTION_MESSAGE_DB_RESPONSE.CREATED_FAILED
    }
  }

}
