import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Database } from "@app/database";
import { Repository } from "typeorm";
import { IServiceResponse } from "@app/rabbit";
import { StoryEntity } from "../entity/story.entity";
import { StoryDraftTextFreeformDto } from "../dto/story.draft.text-freeform.dto";
import { StoryDraftTextGuidedDto } from "../dto/story.draft.text-guided.dto";
import { StoryDraftVideoDto } from "../dto/story.draft.video.dto";
import { STORY_MESSAGE_DB_RESPONSE } from "../constant/story-patterns.constants";

@Injectable()
export class StoryDraftService {

  private readonly logger = new Logger(StoryDraftService.name)

  constructor(
    @InjectRepository(StoryEntity, Database.PRIMARY)  private storyRepository: Repository<StoryEntity>) {}

  public async saveStory ( member_id: string,
                           draftDto: StoryDraftVideoDto|StoryDraftTextFreeformDto|StoryDraftTextGuidedDto )
    : Promise<IServiceResponse<StoryEntity|null>> {

    draftDto.member_id = member_id;
    const draft = await this.storyRepository.create(draftDto);
    const result = await this.storyRepository.save(draft);
    this.logger.log('Story Created - Story Type ' + draftDto.story_type,  JSON.stringify(result));

    return {
      state: !!result,
      data: result,
      message: !!result ? STORY_MESSAGE_DB_RESPONSE.CREATED : STORY_MESSAGE_DB_RESPONSE.CREATED_FAILED
    }

  }

}
