import { Controller, Get } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { SURVEY_MESSAGE_PATTERNS } from './constant/survey-patterns.constants';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateDQ5SurveyInstanceDto } from './dto/create-DQ5-survey-instance.survey.dto';
import { SurveyMemberInstanceEntity } from './entity/survey-member-instances.entity';
import { IServiceResponse } from '@app/rabbit';
import { SubmitSurveyFinalDto } from './dto/submit-survey-final.survey.dto';
import { CreateLongOnBoardingSurveyInstanceDto } from './dto/create-Long-Boarding-survey-instance.survey.dto';
import { CreateShortOnBoardingSurveyInstanceDto } from './dto/create-Short-Boarding-survey-instance.survey.dto';
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
