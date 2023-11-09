import { Controller, Get } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { SURVEY_MESSAGE_PATTERNS } from './constant/survey-patterns.constants';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateSurveyInstanceDto } from './dto/create-survey-instance.survey.dto';
import { SurveyMemberInstanceEntity } from './entities/survey-member-instances.entity';
import { IServiceResponse } from '@app/rabbit';
import { SubmitSurveyFinalDto } from './dto/submit-survey-final.survey.dto';

@Controller()
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @MessagePattern(SURVEY_MESSAGE_PATTERNS.CREATE)
  async register(
    @Payload('createDto') createSurveyInstanceDto: CreateSurveyInstanceDto,
    @Payload('id_member') id_member: string
  ): Promise<IServiceResponse<SurveyMemberInstanceEntity>> {
    const surveyCreateResult = this.surveyService.createSurveyMemberInstance(
      createSurveyInstanceDto,
      id_member
      )
    return surveyCreateResult
  }
  
  @MessagePattern(SURVEY_MESSAGE_PATTERNS.SUBMIT)
  async submit(
    @Payload('submitSurveyFinalDto') submitSurveyFinalDto: SubmitSurveyFinalDto
  ): Promise<IServiceResponse<SurveyMemberInstanceEntity>> {
    const submitSurveyFinalResult = this.surveyService.submitSurveyInstance(submitSurveyFinalDto)
    return submitSurveyFinalResult
  }
}
