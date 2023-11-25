import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Database } from "@app/database";
import { Repository, UpdateResult } from "typeorm";
import { IServiceResponse } from "@app/rabbit";
import { StoryEntity } from "../entity/story/story.entity";
import { StoryUpdateTextFreeFormDto } from "../dto/story/story.update.text-freeform.dto";
import { StoryUpdateTextGuidedDto } from "../dto/story/story.update.text-guided.dto";
import { StoryUpdateVideoDto } from "../dto/story/story.update.video.dto";
import { STORY_MESSAGE_DB_RESPONSE } from "../constant/story-patterns.constants";
import { StoryUpdateSettingDto } from "../dto/story/story.update.setting.dto";
import { StorySettingEntity } from "../entity/story/story.setting.entity";
import { isEmptyOrNull } from "@app/common/validation-rules/object-validation.rule";

@Injectable()
export class StoryUpdateService {

  private readonly logger = new Logger(StoryUpdateService.name)

  constructor(
    @InjectRepository(StoryEntity, Database.PRIMARY)
    private storyRepository: Repository<StoryEntity>,
    @InjectRepository(StorySettingEntity, Database.PRIMARY)
    private storySettingRepository: Repository<StorySettingEntity>
    ) { }

  public async updateStory(
    story_id: string,
    updateDto: StoryUpdateVideoDto | StoryUpdateTextFreeFormDto | StoryUpdateTextGuidedDto
  ): Promise<IServiceResponse<UpdateResult | null>> {

    try {

      updateDto.has_hero_statement = isEmptyOrNull(updateDto.hero_statement) ? false : true;
      const result = await this.storyRepository.update({
        id: story_id
      }, updateDto);

      this.logger.log('Story Updated - Story Type ' + updateDto.story_type, JSON.stringify(result));

      return {
        state: !!result,
        data: result,
        message: !!result ? STORY_MESSAGE_DB_RESPONSE.UPDATED : STORY_MESSAGE_DB_RESPONSE.UPDATED_FAILED
      }

    } catch (error) {
      this.logger.error("Update Story Setting Error: ", error)
      return {
        state: false,
        data: error,
        message: STORY_MESSAGE_DB_RESPONSE.UPDATED_FAILED
      }

    }

  }

  public async updateStorySetting(
    story_id: string,
    updateDto: StoryUpdateSettingDto
  ): Promise<IServiceResponse<UpdateResult | null>> {
    try {
      const storyEntity = new StoryEntity()
      storyEntity.id = story_id

      const result = await this.storySettingRepository.update({
        story: storyEntity
      }, updateDto);
      this.logger.log('Story Setting Updated');

      return {
        state: !!result,
        data: result,
        message: !!result ? STORY_MESSAGE_DB_RESPONSE.UPDATED : STORY_MESSAGE_DB_RESPONSE.UPDATED_FAILED
      }
    } catch (error) {
      this.logger.error("Update Story Setting Error: ", error)
      return {
        state: false,
        data: error,
        message: STORY_MESSAGE_DB_RESPONSE.UPDATED_FAILED
      }

    }

  }

}
