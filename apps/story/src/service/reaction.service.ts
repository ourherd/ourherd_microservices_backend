import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ReactionEntity } from "../entity/reaction/reaction.entity";
import { Database } from "@app/database";
import { Repository } from "typeorm";
import { PostReactionDto } from "../dto/reaction/post.reaction.dto";
import { IServiceResponse } from "@app/rabbit";
import { REACTION_MESSAGE_DB_RESPONSE } from "../constant/reaction-patterns.constants";
import { Payload } from "@nestjs/microservices";

@Injectable()
export class ReactionService {
  private readonly logger = new Logger(ReactionService.name)
  constructor(
    @InjectRepository(ReactionEntity, Database.PRIMARY)  private reactionRepository: Repository<ReactionEntity >) {}

  async reactionToStory( member_id: string, reactionDto: PostReactionDto): Promise<IServiceResponse<ReactionEntity>> {
    this.logger.log('Reaction Post --> ' + JSON.stringify(reactionDto));
    return await this.reaction( member_id, reactionDto );
  }

  private async reaction( member_id: string, reactionDto: PostReactionDto ): Promise<IServiceResponse<ReactionEntity>> {
    const reaction = await this.reactionRepository.findOneBy(
      {
        member_id: member_id,
        story_id: reactionDto.story_id
      }
    );
    reactionDto.member_id = member_id;

    if ( reaction !== null ) {
        if (reactionDto.reaction_type === reaction.reaction_type ) {

          this.logger.log ('REMOVE reaction on story type DTO --> ' + JSON.stringify(reactionDto) );
          const result = await this.reactionRepository.remove( reaction );
          return {
            state: false,
            data: result,
            message: REACTION_MESSAGE_DB_RESPONSE.REMOVED
          }

        } else {
          // Dont remove this will be useful for more than one reaction
          this.logger.log ('UPDATE reaction on story type DTO --> ' + JSON.stringify(reactionDto) );
          const update = await this.reactionRepository.update( { id: reaction.id }, reactionDto );
          return {
            state: !!update,
            data: reaction,
            message: !!reaction ? REACTION_MESSAGE_DB_RESPONSE.CHANGED
              : REACTION_MESSAGE_DB_RESPONSE.NOT_FOUND
          }
        }
    } else {
      this.logger.log ('CREATE reaction on story type DTO --> ' + JSON.stringify(reactionDto) );
      return await this.createReaction( reactionDto );
    }

  }

  private async createReaction ( reactionDto: PostReactionDto ): Promise<IServiceResponse<ReactionEntity>> {

    const reaction = await this.reactionRepository.create(reactionDto);
    const result = await this.reactionRepository.save(reaction);
    return {
      state: !!result,
      data: result,
      message: !!result ? REACTION_MESSAGE_DB_RESPONSE.CREATED : REACTION_MESSAGE_DB_RESPONSE.CREATED_FAILED
    }
  }

}
