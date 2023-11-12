import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ReactionEntity } from "../../../story/src/entity/reaction/reaction.entity";
import { Repository } from "typeorm";
import { Database } from "@app/database";

@Injectable()
export class FeedService {
  private readonly logger = new Logger(FeedService.name)

  // constructor(
  //   @InjectRepository(ReactionEntity, Database.PRIMARY)  private reactionRepository: Repository<ReactionEntity>
  // ) {}

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
