import { Controller, Get } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { SURVEY_MESSAGE_PATTERNS } from './constant/survey-patterns.constants';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateDQ5SurveyInstanceDto } from './dto/create-DQ5-survey-instance.survey.dto';
import { SurveyMemberInstanceEntity } from './entities/survey-member-instances.entity';
import { IServiceResponse } from '@app/rabbit';
import { SubmitSurveyFinalDto } from './dto/submit-survey-final.survey.dto';
import { CreateLongOnBoardingSurveyInstanceDto } from './dto/create-Long-Boarding-survey-instance.survey.dto';
import { CreateShortOnBoardingSurveyInstanceDto } from './dto/create-Short-Boarding-survey-instance.survey.dto';

@Controller()
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @MessagePattern(SURVEY_MESSAGE_PATTERNS.CREATE_DQ5)
  async createSurveyDQ5Instance(
    @Payload('createDto') createSurveyInstanceDto: CreateDQ5SurveyInstanceDto,
    @Payload('id_member') id_member: string
  ): Promise<IServiceResponse<SurveyMemberInstanceEntity>> {
    const surveyCreateResult = this.surveyService.createSurveyMemberInstance(
      createSurveyInstanceDto,
      id_member
      )
    return surveyCreateResult
  }
  
  @MessagePattern(SURVEY_MESSAGE_PATTERNS.CREATE_LONG)
  async createSurveyLongInstance(
    @Payload('createDto') createSurveyInstanceDto: CreateLongOnBoardingSurveyInstanceDto,
    @Payload('id_member') id_member: string
  ): Promise<IServiceResponse<SurveyMemberInstanceEntity>> {
    const surveyCreateResult = this.surveyService.createSurveyMemberInstance(
      createSurveyInstanceDto,
      id_member
      )
    return surveyCreateResult
  }
  
  @MessagePattern(SURVEY_MESSAGE_PATTERNS.CREATE_SHORT)
  async createSurveyShortInstance(
    @Payload('createDto') createSurveyInstanceDto: CreateShortOnBoardingSurveyInstanceDto,
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
