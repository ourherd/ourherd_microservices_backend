import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { StoryEntity } from "../../entity/story/story.entity";
import { Database } from "@app/database";
import { Repository } from "typeorm";
import { StorySettingEntity } from "../../entity/story/story.setting.entity";
import { MemberService } from "../../../../member/src/service/member.service";
import { StorySettingDto } from "../../dto/story/story.setting.dto";
import { MEMBER_MESSAGE_DB_RESPONSE } from "../../../../member/src/constant/member-patterns.constants";

@Injectable()
export class StorySettingService {

  private readonly logger = new Logger(StorySettingService.name);

  constructor(
    @InjectRepository(StorySettingEntity, Database.PRIMARY)
    private storySettingRepository: Repository<StorySettingEntity>,
    private memberService: MemberService
  ) { }

  async setStorySetting(member_id: string, draft: StoryEntity) {

    try {
      let storySettingDto = new StorySettingDto;
      const memberPrivacySetting = await this.memberService.memberPrivacySetting(member_id);
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
      await this.storySettingRepository.create(storySetting)
      this.logger.log('Story Setting Created ID ', JSON.stringify(storySetting.id) );

    } catch (error) {
      this.logger.error("Story Setting Created Error: ", error)
    }
  }

}
