import { Injectable, Logger } from "@nestjs/common";
import { SurveyService } from "../../../survey/src/service/survey.service";
import { IServiceResponse } from "@app/rabbit";
import { StoryDraftVideoDto } from "../dto/story/story.draft.video.dto";
import { StoryDraftTextFreeformDto } from "../dto/story/story.draft.text-freeform.dto";
import { StoryDraftTextGuidedDto } from "../dto/story/story.draft.text-guided.dto";
import { StoryEntity } from "../entity/story/story.entity";
import { SurveyMemberInstanceEntity } from "../../../survey/src/entity/survey-member-instances.entity";
import { StoryDraftService } from "../service/story/story.draft.service";
import { StorySettingService } from "../service/story/story.setting.service";
import { StoryService } from "../service/story/story.service";

@Injectable()
export class StoryDraftSaga {

  private logger = new Logger(StoryDraftSaga.name);
  constructor(
      private readonly draftService: StoryDraftService,
      private readonly settingService: StorySettingService,
      private readonly surveyService: SurveyService,
      private readonly storyService: StoryService,
  ){}

  /**
   * @remarks
   * @param StoryDraftVideoDto
   * @return StoryEntity
   */
  public async createDraftStory(
    member_id: string,
    draftDto: StoryDraftVideoDto | StoryDraftTextFreeformDto | StoryDraftTextGuidedDto
  ): Promise<IServiceResponse<StoryEntity | null>> {

    const dq5Valid = await this.checkValidDQ5(member_id);
    if (dq5Valid.state === true){
      const draft = await this.draftService.saveStory( member_id, draftDto);
      await this.storySettingCreated(member_id, draft.data);
      await this.storySurveyCreated(draft.data.id, dq5Valid.data);
      return draft;
    }
    this.logger.log('Invalid DQ5 due to ' + dq5Valid.message );
    return {
      state: false,
      data: null,
      message: dq5Valid.message
    };
  }

  /**
   * @remarks
   * @param member_id
   * @return StoryEntity
   */
  private async checkValidDQ5 ( member_id: string ): Promise<IServiceResponse<SurveyMemberInstanceEntity>> {
    const dq5Valid = await this.surveyService.completeDQ5SurveyCheck(member_id);
    console.log(dq5Valid);
    return dq5Valid;
  }

  /**
   * @remarks
   * @param member_id & draft StoryEntity
   */
  private async storySettingCreated ( member_id: string, draft: StoryEntity ) {
    await this.settingService.setStorySetting(member_id, draft)
  }

  /**
   * @remarks
   * @param member_id & story_id & survey_id
   */
  private async storySurveyCreated ( story_id: string, survey: SurveyMemberInstanceEntity ) {
    await this.storyService.storySurvey(story_id, survey);
  }

}
