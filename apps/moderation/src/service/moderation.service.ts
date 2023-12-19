import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Database } from "@app/database";
import { Repository } from "typeorm";
import { ModerationEntity } from "../entity/moderation.entity";
import { IServiceResponse } from "@app/rabbit";
import { isEmptyOrNull } from "@app/common/validation-rules/object-validation.rule";
import { MODERATION_STORY_MESSAGE_DB_RESPONSE } from "../constant/moderation-patterns.constants";
import { CreateModerationDto } from "../dto/create-moderation.dto";
import { StoryModerationService } from "./story.moderation.service";
import { MemberModerationService } from "./member.moderation.service";
import { UpdateModerationDto } from "../dto/update-moderation.dto";
import { DeleteModerationDto } from "../dto/delete-moderation.dto";

@Injectable()
export class ModerationService {

  logger = new Logger(ModerationService.name);

  constructor(
    private readonly storyService: StoryModerationService,
    private readonly memberService: MemberModerationService,
    @InjectRepository(ModerationEntity, Database.PRIMARY) private moderationRepository: Repository<ModerationEntity>
  ) { }

  async getModerationStory(story_id: string): Promise<IServiceResponse<ModerationEntity[]>> {
    const moderation = await this.getModerationByStory(story_id);
    return moderation;
  }

  async createModeration (member_id: string, story_id: string, dto: CreateModerationDto):
    Promise<IServiceResponse<ModerationEntity>> {

    const story = await this.storyService.getStory(story_id);
    if (story.state === false) throw new NotFoundException('NotFoundException');

    const member = await this.memberService.getMember(member_id);
    if (member.state === false) throw new NotFoundException('NotFoundException');

    dto.story_id = story_id;
    dto.moderator_name = isEmptyOrNull(member.data.first_name) ? member.data.email : member.data.first_name;

    const moderation = this.moderationRepository.create(dto);
    const result = await this.moderationRepository.save(moderation);

    return {
      state: true,
      data: result
    }
  }

  async updateModeration (member_id: string, dto: UpdateModerationDto):
    Promise<IServiceResponse<ModerationEntity>> {

    const moderation = await this.getModeration(dto.id);
    if (isEmptyOrNull(moderation)) {
      return {
        state: false,
        data: null,
        message: MODERATION_STORY_MESSAGE_DB_RESPONSE.MODERATION_NOT_FOUND
      }
    }

    await this.moderationRepository.update({ id: dto.id }, dto);
    const result = await this.moderationRepository.findOneBy({ id: dto.id });

    return {
      state: !!result,
      data: result,
      message: MODERATION_STORY_MESSAGE_DB_RESPONSE.CHANGED
    }
  }

  public async deleteModeration (member_id: string, dto: DeleteModerationDto): Promise<IServiceResponse<any>> {

    const moderation = await this.getModeration(dto.id);
    if (isEmptyOrNull(moderation)) {
      return {
        state: false,
        data: null,
        message: MODERATION_STORY_MESSAGE_DB_RESPONSE.MODERATION_NOT_FOUND
      }
    }
    dto.deleted_at = new Date().toISOString();

    await this.moderationRepository.update({ id: dto.id }, dto);

    return {
      state: true,
      data: null,
      message: MODERATION_STORY_MESSAGE_DB_RESPONSE.MODERATION_DELETED
    }
  }

  private async getModerationByStory(story_id: string): Promise<IServiceResponse<ModerationEntity[]>> {

    const entities = await this.moderationRepository.createQueryBuilder('moderation')
      .where('moderation.story_id=:story_id' , { story_id: story_id })
      .andWhere('moderation.deleted_at IS NULL')
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

  private async getModeration(moderation_id: string): Promise<ModerationEntity> {
    return await this.moderationRepository.findOneBy({ id: moderation_id });
  }


}
