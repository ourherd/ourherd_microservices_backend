import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Database } from "@app/database";
import { Repository } from "typeorm";
import { IServiceResponse } from "@app/rabbit";
import { StoryEntity } from "../entity/story/story.entity";
import { StoryDraftTextFreeformDto } from "../dto/story/story.draft.text-freeform.dto";
import { StoryDraftTextGuidedDto } from "../dto/story/story.draft.text-guided.dto";
import { StoryDraftVideoDto } from "../dto/story/story.draft.video.dto";
import { STORY_MESSAGE_DB_RESPONSE } from "../constant/story-patterns.constants";
import { StorySettingEntity } from "../entity/story/story.setting.entity";
import { MEMBER_MESSAGE_DB_RESPONSE } from "apps/member/src/constant/member-patterns.constants";
import { MemberService } from "apps/member/src/service/member.service";
import { StorySettingDto } from "../dto/story/story.setting.dto";

@Injectable()
export class StoryDraftService {

  private readonly logger = new Logger(StoryDraftService.name)

  constructor(
    @InjectRepository(StoryEntity, Database.PRIMARY)
    private storyRepository: Repository<StoryEntity>,
    @InjectRepository(StorySettingEntity, Database.PRIMARY)
    private storySettingRepository: Repository<StorySettingEntity>,
    private memberService: MemberService
  ) { }

  public async saveStory(
    member_id: string,
    draftDto: StoryDraftVideoDto | StoryDraftTextFreeformDto | StoryDraftTextGuidedDto
  ): Promise<IServiceResponse<StoryEntity | null>> {

    try {
      
      
      draftDto.member_id = member_id;
      const draft = this.storyRepository.create(draftDto);
      const result = await this.storyRepository.save(draft);
      this.validateMemberInfo(member_id, draft)
      this.logger.log('Story Created - Story Type ' + draftDto.story_type, JSON.stringify(result));
      
      return {
        state: !!result,
        data: result,
        message: !!result ? STORY_MESSAGE_DB_RESPONSE.CREATED : STORY_MESSAGE_DB_RESPONSE.CREATED_FAILED
      }
    } catch (error) {
      this.logger.error("Story Setting Created Error: ", error)
    }

  }

  async validateMemberInfo(member_id: string, draft: StoryEntity): Promise<IServiceResponse<StorySettingEntity>> {

    try {

      let storySettingDto = new StorySettingDto();

      const memberPrivacySetting = await this.memberService.memberPrivacySetting(member_id)

      if (!memberPrivacySetting.member) {
        return {
          state: false,
          data: null,
          message: MEMBER_MESSAGE_DB_RESPONSE.EMAIL_NOT_FOUND
        }
      }

      Object.assign(storySettingDto, memberPrivacySetting);
      storySettingDto.story = draft

      const storySetting = await this.storySettingRepository.save(storySettingDto)
      const storySettingCreated = this.storySettingRepository.create(storySetting)

      this.logger.log('Story Setting Created');

      return {
        state: !!storySettingCreated,
        data: storySetting,
      }
    } catch (error) {

      this.logger.error("Story Setting Created Error: ", error)

    }
  }

}
