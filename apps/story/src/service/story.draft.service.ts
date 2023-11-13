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
import { MemberEntity } from "apps/member/src/entity/member.entity";
import { MEMBER_MESSAGE_DB_RESPONSE } from "apps/member/src/constant/member-patterns.constants";

@Injectable()
export class StoryDraftService {

  private readonly logger = new Logger(StoryDraftService.name)

  constructor(
    @InjectRepository(StoryEntity, Database.PRIMARY) 
    private storyRepository: Repository<StoryEntity>,
    @InjectRepository(StorySettingEntity, Database.PRIMARY) 
    private storySettingRepository: Repository<StorySettingEntity>,
    @InjectRepository(MemberEntity, Database.PRIMARY) 
    private memberRepository: Repository<MemberEntity>
  ) { }

  public async saveStory(
    member_id: string,
    draftDto: StoryDraftVideoDto | StoryDraftTextFreeformDto | StoryDraftTextGuidedDto
  ): Promise<IServiceResponse<StoryEntity | null>> {

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

  }

  async validateMemberInfo(member_id: string, draft: StoryEntity): Promise<IServiceResponse<StorySettingEntity>> {

    let storySettingEntity = new StorySettingEntity();

    const member = await this.memberRepository.findOneBy({
      id: member_id
    });

    if (!!member === false) {
      return {
        state: false,
        data: null,
        message: MEMBER_MESSAGE_DB_RESPONSE.EMAIL_NOT_FOUND
      }
    }

    if (!!member.gender && member.gender.length != 0) {
      storySettingEntity.share_gender = true
    }
    
    if (!!member.birthday) {
      storySettingEntity.share_age = true
    }

    if (!!member.first_name && member.first_name.length != 0) {
      storySettingEntity.share_name = true
    }

    if (
      !!member.country && member.country.length != 0 ||
      !!member.suburb && member.suburb.length != 0 ||
      !!member.postal_code && member.postal_code.length != 0
      ) {
      storySettingEntity.share_location = true
    }

    storySettingEntity.story = draft

    const storySetting = await this.storySettingRepository.save(storySettingEntity)
    const storySettingCreated = this.storySettingRepository.create(storySettingEntity)

    return {
      state: !!storySettingCreated,
      data: storySetting,
    }
  }

}
