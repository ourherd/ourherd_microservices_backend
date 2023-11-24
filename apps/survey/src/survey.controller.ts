import { Controller } from "@nestjs/common";
import { SurveyService } from "./survey.service";
import { SURVEY_MESSAGE_PATTERNS } from "./constant/survey-patterns.constants";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { SurveyMemberInstanceEntity } from "./entity/survey-member-instances.entity";
import { IServiceResponse } from "@app/rabbit";
import { SubmitSurveyFinalDto } from "./dto/submit-survey-final.survey.dto";
import { CreateInstanceSurveyDto } from "./dto/create-instance.survey.dto";

@Controller()
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}


  @MessagePattern(SURVEY_MESSAGE_PATTERNS.START)
  async startSurveyInstance(
    @Payload('member_id') member_id: string,
  @Payload('createDto') createSurveyInstanceDto: CreateInstanceSurveyDto
  ): Promise<IServiceResponse<SurveyMemberInstanceEntity>> {

    const surveyCreated = this.surveyService.createSurveyMemberInstance(
      member_id,
      createSurveyInstanceDto
    );

    return surveyCreated;

  }

  @MessagePattern(SURVEY_MESSAGE_PATTERNS.SUBMIT)
  async submit(
    @Payload('submitSurveyFinalDto') submitSurveyFinalDto: SubmitSurveyFinalDto
  ): Promise<IServiceResponse<SurveyMemberInstanceEntity>> {
    const surveyFinalCreated = this.surveyService.submitSurveyInstance(submitSurveyFinalDto)
    return surveyFinalCreated;
  }
}
