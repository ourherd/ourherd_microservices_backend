import { Controller, Logger } from "@nestjs/common";
import { ModerationService } from "./service/moderation.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { MODERATION_MESSAGE_PATTERNS } from "./constant/moderation-patterns.constants";
import { IServiceResponse } from "@app/rabbit";
import { ModerationEntity } from "./entity/moderation.entity";
import { CreateModerationDto } from "./dto/create-moderation.dto";
import { UpdateModerationDto } from "./dto/update-moderation.dto";
import { DeleteModerationDto } from "./dto/delete-moderation.dto";
import { CreatedModerationSaga } from "./saga/created.moderation.saga";

@Controller()
export class ModerationController {

  logger = new Logger(ModerationController.name);

  constructor(
    private readonly createdModerationSaga: CreatedModerationSaga,
    private readonly moderationService: ModerationService) {}

  @MessagePattern(MODERATION_MESSAGE_PATTERNS.CREATE)
  async createModeration(
    @Payload('member_id') member_id: string,
    @Payload('story_id') story_id: string,
    @Payload('dto') dto: CreateModerationDto ):
    Promise<IServiceResponse<ModerationEntity>>{
    return await this.createdModerationSaga.created(member_id, story_id, dto);
  }

  @MessagePattern(MODERATION_MESSAGE_PATTERNS.BY_STORY)
  async getModerationStory(@Payload('story_id') story_id: string ):
    Promise<IServiceResponse<ModerationEntity[]>>{
    return await this.moderationService.getModerationStory(story_id);
  }

  @MessagePattern(MODERATION_MESSAGE_PATTERNS.UPDATE)
  async updateModeration(
    @Payload('member_id') member_id: string,
    @Payload('dto') dto: UpdateModerationDto ):
    Promise<IServiceResponse<ModerationEntity>>{
    return await this.moderationService.updateModeration(member_id, dto);
  }

  @MessagePattern(MODERATION_MESSAGE_PATTERNS.DELETE)
  async deleteModeration(
    @Payload('member_id') member_id: string,
    @Payload('dto') dto: DeleteModerationDto ):
    Promise<IServiceResponse<any>>{
    return await this.moderationService.deleteModeration( member_id, dto);
  }

}
