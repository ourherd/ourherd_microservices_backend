import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { StoryEntity } from "../../../story/src/entity/story/story.entity";
import { Database } from "@app/database";
import { Repository } from "typeorm";
import { IServiceResponse } from "@app/rabbit";
import { isEmptyOrNull } from "@app/common/validation-rules/object-validation.rule";
import { MODERATION_STORY_MESSAGE_DB_RESPONSE } from "../constant/moderation-patterns.constants";
import { StoryStatus } from "../../../story/src/constant/story.enum";
import { ModerationStatus } from "../entity/moderation.entity";

@Injectable()
export class StoryModerationService {

  constructor(
    @InjectRepository(StoryEntity, Database.PRIMARY) private storyRepository: Repository<StoryEntity>,
  ) { }

  async getStory(story_id: string): Promise<IServiceResponse<StoryEntity>> {
    const result = await this.storyRepository.findOneBy({
      id: story_id
    });

    if (isEmptyOrNull(result)) {
      return {
        state: false,
        data: null,
        message: MODERATION_STORY_MESSAGE_DB_RESPONSE.STORY_NOT_FOUND
      }
    }

    return {
      state: true,
      data: result,
      message: MODERATION_STORY_MESSAGE_DB_RESPONSE.STORY_FOUND
    }
  }

  async updateStoryStatus(story_id: string, status: StoryStatus): Promise<StoryEntity> {

    await this.storyRepository.update( story_id, { story_status: status });
    return await this.storyRepository.findOneBy( { id: story_id });
  }
}
