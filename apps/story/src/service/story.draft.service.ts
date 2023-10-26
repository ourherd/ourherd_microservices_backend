import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Database } from "@app/database";
import { Repository } from "typeorm";
import { IServiceResponse } from "@app/rabbit";
import { StoryEntity } from "../entity/story.entity";
import { StoryDraftTextFreeformDto } from "../dto/story.draft.text-freeform.dto";
import { StoryDraftTextGuidedDto } from "../dto/story.draft.text-guided.dto";

@Injectable()
export class StoryDraftService {

  private readonly logger = new Logger(StoryDraftService.name)

  constructor(
    @InjectRepository(StoryEntity, Database.PRIMARY)  private storyRepository: Repository<StoryEntity>) {}

  async draftGuided ( draftGuidedDto: StoryDraftTextGuidedDto ) : Promise<IServiceResponse<StoryEntity|null>>{

    const draft = await this.storyRepository.create(draftGuidedDto);
    const result = await this.storyRepository.save(draft);
    return {
      state: !!result,
      data: result,
      message: !!result ? 'CREATED' : 'CREATED_FAILED'
    }
  }

  async draftFreeForm ( draftFreeFormDto: StoryDraftTextFreeformDto ) : Promise<IServiceResponse<StoryEntity|null>>{

    const draft = await this.storyRepository.create(draftFreeFormDto);
    const result = await this.storyRepository.save(draft);
    return {
      state: !!result,
      data: result,
      message: !!result ? 'CREATED' : 'CREATED_FAILED'
    }
  }


}
