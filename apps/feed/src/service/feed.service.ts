import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReactionEntity } from "../entity/reaction.entity";
import { Repository } from "typeorm";
import { PostReactionDto } from "../dto/post.reaction.dto";
import { IServiceResponse } from "@app/rabbit";
import { Database } from "@app/database";
import { REACTION_MESSAGE_DB_RESPONSE } from "../constant/reaction-patterns.constants";

@Injectable()
export class FeedService {
  private readonly logger = new Logger(FeedService.name)

  constructor(
    @InjectRepository(ReactionEntity, Database.PRIMARY)  private reactionRepository: Repository<ReactionEntity>
  ) {}

  // TODO Add reaction entity to be the return object
  // async findReaction(member_id: string, story_id: string): Promise<Boolean> {
  //   // const reaction = await this.reactionRepository.find(
  //   //   {
  //   //     where:{
  //   //       member_id: member_id,
  //   //       story_id: story_id
  //   //     }, withDeleted: false,
  //   //   }
  //   // );
  //   //
  //   // this.logger.log('reactionRepository ' + JSON.stringify(reaction));
  //
  //   return true;
  // }
  //
  // async deleteReaction(member_id: string, story_id: string) {
  //
  // }

}
