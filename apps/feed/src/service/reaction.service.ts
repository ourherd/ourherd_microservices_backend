import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Database } from "@app/database";
import { Repository } from "typeorm";
import { ReactionEntity, ReactionType } from "../../../story/src/entity/reaction/reaction.entity";
import { StoryDto } from "../dto/story.dto";
import { isEmptyOrNull } from "@app/common/validation-rules/object-validation.rule";

@Injectable()
export class ReactionService {

  private readonly logger = new Logger(ReactionService.name);

  constructor(
    @InjectRepository(ReactionEntity, Database.PRIMARY)  private reactionRepository: Repository<ReactionEntity>
  ) {}

  async getReactionStoryByMember (member_id: string, dto: StoryDto): Promise<StoryDto> {

    const reaction = await this.reactionRepository.findOneBy({
      member_id: member_id,
      story_id: dto.id
    });
    dto.has_reaction = isEmptyOrNull(reaction) ? false: true;
    dto.reaction_type = ReactionType.LOVE;

    return dto;
  }

}
