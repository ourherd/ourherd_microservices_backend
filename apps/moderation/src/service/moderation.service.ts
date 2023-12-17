import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Database } from "@app/database";
import { Repository } from "typeorm";
import { StoryEntity } from "../../story/src/entity/story/story.entity";
import { ModerationEntity } from "./entity/moderation.entity";
import { IServiceResponse } from "@app/rabbit";
import { isEmptyOrNull } from "@app/common/validation-rules/object-validation.rule";
import { MODERATION_STORY_MESSAGE_DB_RESPONSE } from "./constant/moderation-patterns.constants";
import { CreateModerationDto } from "./dto/create-moderation.dto";

@Injectable()
export class ModerationService {

  constructor(
    @InjectRepository(StoryEntity, Database.PRIMARY) private storyRepository: Repository<StoryEntity>,
    @InjectRepository(ModerationEntity, Database.PRIMARY) private moderationRepository: Repository<ModerationEntity>
  ) { }

  async getModerationStory(story_id: string): Promise<IServiceResponse<ModerationEntity[]>> {
    const moderation = await this.getModerationByStory(story_id);
    return moderation;
  }

  async createModeration (story_id: string, member_id: string): Promise<IServiceResponse<ModerationEntity>> {
    const dto = new CreateModerationDto();
    dto.moderator_name =
    dto.story_id = story_id;
  }

  private async getModerationByStory(story_id: string): Promise<IServiceResponse<ModerationEntity[]>> {

    const result = await this.moderationRepository.findBy({
      story_id : story_id
    });

    if (isEmptyOrNull(result)) {
      return {
        state: false,
        data: null,
        message: MODERATION_STORY_MESSAGE_DB_RESPONSE.NO_MODERATION
      }
    }

    return {
      state: true,
      data: result,
    }

  }


}
