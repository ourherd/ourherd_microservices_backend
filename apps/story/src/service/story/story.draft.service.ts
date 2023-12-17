import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Database } from "@app/database";
import { Repository, UpdateResult } from "typeorm";
import { IServiceResponse, RabbitServiceName } from "@app/rabbit";
import { StoryEntity } from "../../entity/story/story.entity";
import { StoryDraftTextFreeformDto } from "../../dto/story/story.draft.text-freeform.dto";
import { StoryDraftTextGuidedDto } from "../../dto/story/story.draft.text-guided.dto";
import { StoryDraftVideoDto } from "../../dto/story/story.draft.video.dto";
import { STORY_MESSAGE_DB_RESPONSE } from "../../constant/story-patterns.constants";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import {
  MEDIA_MESSAGE_PATTERNS,
  TRANSCRIBE_MESSAGE_PATTERNS
} from "../../../../media/src/constant/media-patterns.constants";

@Injectable()
export class StoryDraftService {

  private readonly logger = new Logger(StoryDraftService.name);

  constructor(
    @InjectRepository(StoryEntity, Database.PRIMARY) private storyRepository: Repository<StoryEntity>,
    @Inject(RabbitServiceName.MEDIA) private mediaClient: ClientProxy
  ) { }

  public async saveStory(
    member_id: string,
    draftDto: StoryDraftVideoDto | StoryDraftTextFreeformDto | StoryDraftTextGuidedDto
  ): Promise<IServiceResponse<StoryEntity | null>> {

    try {
      // TODO move this into the DTO
      draftDto.member_id = member_id;
      const draft = this.storyRepository.create(draftDto);
      const result = await this.storyRepository.save(draft);
      this.logger.log('Story Created - Story Type ' + draftDto.story_type, JSON.stringify(result));

      await this.createImage(draft.id, draft.story_type);

      return {
        state: !!result,
        data: result,
        message: !!result ? STORY_MESSAGE_DB_RESPONSE.CREATED : STORY_MESSAGE_DB_RESPONSE.CREATED_FAILED
      }
    } catch (error) {
      this.logger.error("Story Setting Created Error: ", error)
    }
  }

  private async createImage ( story_id: string, story_type: string ) : Promise<void> {
    this.logger.log('Create Image - Story Type ' + story_type + " / " + story_id);

    await firstValueFrom(
      this.mediaClient.emit<IServiceResponse<UpdateResult>, { story_id: string,  story_type: string }>(
        MEDIA_MESSAGE_PATTERNS.CREATE_IMAGE,
        {
          story_id,
          story_type
        }
      )
    );
  }


}
