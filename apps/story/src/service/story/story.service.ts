import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { StoryEntity } from "../../entity/story/story.entity";
import { Database } from "@app/database";
import { Repository } from "typeorm";
import { IServiceResponse } from "@app/rabbit";
import { STORY_MESSAGE_DB_RESPONSE } from "../../constant/story-patterns.constants";
import { isEmptyOrNull } from "@app/common/validation-rules/object-validation.rule";
import { StoryStatus } from "../../constant/story.enum";
import { StoryUpdateStatusResponseDto } from "../../dto/story/story.update.status.response.dto";

@Injectable()
export class StoryService {

  private readonly logger = new Logger(StoryService.name);

  constructor(
    @InjectRepository(StoryEntity, Database.PRIMARY) private storyRepository: Repository<StoryEntity>,
    ) { }

  public async getStoryByID (story_id :string, member_id: string):  Promise<IServiceResponse<StoryEntity>> {
    const story = await this.storyRepository.findOneBy({ id: story_id, member_id:member_id });
    this.logger.log('Story details  id ' + JSON.stringify(story_id));
    return {
      state: !isEmptyOrNull(story),
      data: story,
      message: !!story ? STORY_MESSAGE_DB_RESPONSE.FOUND : STORY_MESSAGE_DB_RESPONSE.NO_FOUND
    }
  }
  //
  public async updateStatusStory (story :StoryEntity, status: StoryStatus):  Promise<StoryUpdateStatusResponseDto> {
    story.story_status = status
    await this.storyRepository.update({ id: story.id }, story);

    let response = new StoryUpdateStatusResponseDto()
    response.id = story.id;
    response.member_id = story.member_id;
    response.status = story.story_status;
    return response;
  }


}
