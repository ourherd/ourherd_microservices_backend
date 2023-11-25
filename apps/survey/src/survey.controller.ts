import { Controller } from "@nestjs/common";
import { SurveyService } from "./service/survey.service";
import { SURVEY_MESSAGE_PATTERNS } from "./constant/survey-patterns.constants";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { SurveyMemberInstanceEntity } from "./entity/survey-member-instances.entity";
import { IServiceResponse } from "@app/rabbit";
import { SubmitSurveyFinalDto } from "./dto/submit-survey-final.survey.dto";
import { CreateInstanceSurveyDto } from "./dto/create-instance.survey.dto";
import { SurveyFinalService } from "./service/survey.final.service";

@Controller()
export class SurveyController {
  constructor(
    private readonly surveyService: SurveyService,
    private readonly surveyFinalService: SurveyFinalService,
  ) {}

  @MessagePattern(SURVEY_MESSAGE_PATTERNS.START)
  async startSurveyInstance(
    @Payload('member_id') member_id: string,
  @Payload('createDto') createSurveyInstanceDto: CreateInstanceSurveyDto
  ): Promise<IServiceResponse<SurveyMemberInstanceEntity>> {

    const survey = this.surveyService.createSurveyMemberInstance(
      member_id,
      createSurveyInstanceDto
    );
    return survey;
  }

  @MessagePattern(SURVEY_MESSAGE_PATTERNS.SUBMIT)
  async submit(
    @Payload('submitSurveyFinalDto') submitSurveyFinalDto: SubmitSurveyFinalDto
  ): Promise<IServiceResponse<SurveyMemberInstanceEntity>> {
    const surveyFinal = this.surveyFinalService.submitSurvey(submitSurveyFinalDto)
    return surveyFinal;
  }
}
