import { Injectable } from '@nestjs/common';
import { IServiceResponse } from "@app/rabbit";
import { ReactionEntity } from "./entity/reaction.entity";
import { PostReactionDto } from "./dto/post.reaction.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Database } from "@app/database";
import { Repository } from "typeorm";
import { MemberEntity } from "../../member/src/entity/member.entity";
import { MEMBER_MESSAGE_DB_RESPONSE } from "../../member/src/constant/member-patterns.constants";

@Injectable()
export class FeedService {

  constructor(
    @InjectRepository(ReactionEntity, Database.PRIMARY)  private reactionRepository: Repository<ReactionEntity>
  ) {}

  async reactToStory(postReactionDto: PostReactionDto): Promise<IServiceResponse<ReactionEntity>> {

  }

  // TODO Add reaction entity to be the return object
  async findReaction(member_id: string, story_id: string): Promise<Boolean> {
    const reaction = await this.reactionRepository.find(
      {
        where:{
          member_id: member_id,
          story_id: story_id
        }, withDeleted: false,
      }
    );
    return (reaction === null) ? false: true;
  }

  async deleteReaction(member_id: string, story_id: string) {

  }




  }
