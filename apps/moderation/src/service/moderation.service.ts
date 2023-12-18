import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Database } from "@app/database";
import { Repository } from "typeorm";
import { ModerationEntity } from "../entity/moderation.entity";
import { IServiceResponse } from "@app/rabbit";
import { isEmptyOrNull } from "@app/common/validation-rules/object-validation.rule";
import { MODERATION_STORY_MESSAGE_DB_RESPONSE } from "../constant/moderation-patterns.constants";
import { CreateModerationDto } from "../dto/create-moderation.dto";
import { StoryModerationService } from "./story.moderation.service";
import { StaffModerationService } from "./staff.moderation.service";

@Injectable()
export class ModerationService {

  constructor(
    private readonly storyModerationService: StoryModerationService,
    private readonly staffModerationService: StaffModerationService,
    @InjectRepository(ModerationEntity, Database.PRIMARY) private moderationRepository: Repository<ModerationEntity>
  ) { }

  async getModerationStory(story_id: string): Promise<IServiceResponse<ModerationEntity[]>> {
    const moderation = await this.getModerationByStory(story_id);
    return moderation;
  }

  async createModeration (member_id: string, story_id: string, dto: CreateModerationDto):
    Promise<IServiceResponse<ModerationEntity>> {

    const story = await this.storyModerationService.getStory(story_id);
    if (story.state === false) throw new NotFoundException('NotFoundException');

    const member = await this.staffModerationService.getMember(member_id);
    if (member.state === true) throw new NotFoundException('NotFoundException');

    dto.story_id = story_id;
    dto.moderator_name = isEmptyOrNull(member.data.first_name) ? member.data.email : member.data.first_name;

    const moderation = this.moderationRepository.create(dto);
    const result = await this.moderationRepository.save(moderation);

    return {
      state: true,
      data: result
    }
  }

  private async getModerationByStory(story_id: string): Promise<IServiceResponse<ModerationEntity[]>> {

    const entities = await this.moderationRepository.createQueryBuilder('moderation')
      .where('moderation.story_id=:story_id' , { story_id: story_id })
      .orderBy('moderation.revision', 'DESC')
      .getMany();

    if (isEmptyOrNull(entities)) {
      return {
        state: false,
        data: null,
        message: MODERATION_STORY_MESSAGE_DB_RESPONSE.NO_MODERATION
      }
    }

    return {
      state: true,
      data: entities,
    }

  }


}
