import { Injectable, Logger } from "@nestjs/common";
import { SurveyService } from "../../../survey/src/service/survey.service";
import { IServiceResponse } from "@app/rabbit";
import { StoryDraftVideoDto } from "../dto/story/story.draft.video.dto";
import { StoryDraftTextFreeformDto } from "../dto/story/story.draft.text-freeform.dto";
import { StoryDraftTextGuidedDto } from "../dto/story/story.draft.text-guided.dto";
import { StoryEntity } from "../entity/story/story.entity";
import { SurveyMemberInstanceEntity } from "../../../survey/src/entity/survey-member-instances.entity";
import { StoryDraftService } from "../service/story/story.draft.service";

@Injectable()
export class StoryDraftSaga {

  private logger = new Logger(StoryDraftSaga.name);
  constructor(
      private readonly draftService: StoryDraftService,
      private surveyService: SurveyService,
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
    if (dq5Valid.state){
      const draft = await this.draftService.saveStory( member_id, draftDto);
      await this.storySettingCreated(member_id, draft.data);
      return draft;
    }
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
    return dq5Valid;
  }

  /**
   * @remarks
   * @param member_id & draft StoryEntity
   */
  private async storySettingCreated ( member_id: string, draft: StoryEntity ) {
    await this.draftService.setStorySetting(member_id, draft)
  }

}
