import { Controller } from "@nestjs/common";
import { StoryUpdateService } from "../../service/story/story.update.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { STORY_MESSAGE_PATTERNS } from "../../constant/story-patterns.constants";
import { IServiceResponse } from "@app/rabbit";
import { StoryUpdateTextFreeFormDto } from "../../dto/story/story.update.text-freeform.dto";
import { StoryUpdateTextGuidedDto } from "../../dto/story/story.update.text-guided.dto";
import { StoryUpdateVideoDto } from "../../dto/story/story.update.video.dto";
import { UpdateResult } from "typeorm";
import { StoryUpdateSettingDto } from "../../dto/story/story.update.setting.dto";
import { StoryUpdateSaga } from "../../saga/story.update.saga";

@Controller()
export class StoryUpdateController {

  constructor(
    private readonly updateService: StoryUpdateService,
    private readonly updateSaga: StoryUpdateSaga
  ) {}

  @MessagePattern(STORY_MESSAGE_PATTERNS.UPDATE_VIDEO)
  async updateVideo (
    @Payload('story_id') story_id: string,
    @Payload('updateVideoDto') updateVideoDto: StoryUpdateVideoDto):
    Promise<IServiceResponse<UpdateResult>> {
    return await this.updateSaga.updateContentStory( story_id, updateVideoDto );
  }

  @MessagePattern(STORY_MESSAGE_PATTERNS.UPDATE_TEXT_GUIDE)
  async updateTextGuide (
    @Payload('story_id') story_id: string,
    @Payload('updateGuidedDto') updateGuidedDto: StoryUpdateTextGuidedDto):
    Promise<IServiceResponse<UpdateResult>> {
    return await this.updateSaga.updateContentStory( story_id, updateGuidedDto );
  }

  @MessagePattern(STORY_MESSAGE_PATTERNS.UPDATE_TEXT_FREE_FORM)
  async updateFreeForm (
    @Payload('story_id') story_id: string,
    @Payload('updateFreeFormDto') updateFreeFormDto: StoryUpdateTextFreeFormDto):
    Promise<IServiceResponse<UpdateResult>> {
    return await this.updateSaga.updateContentStory( story_id, updateFreeFormDto );
  }

  @MessagePattern(STORY_MESSAGE_PATTERNS.UPDATE_SETTING)
  async updateSetting (
    @Payload('story_id') story_id: string,
    @Payload('updateSettingDto') updateSettingDto: StoryUpdateSettingDto):
    Promise<IServiceResponse<UpdateResult>> {
    return await this.updateService.updateStorySetting( story_id, updateSettingDto );
  }

}
