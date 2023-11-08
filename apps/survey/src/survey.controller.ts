import { Controller, Get } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { SURVEY_MESSAGE_PATTERNS } from './constant/survey-patterns.constants';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateSurveyInstanceDto } from './dto/create-survey-instance.survey.dto';
import { SurveyMemberInstanceEntity } from './entities/survey-member-instances.entity';
import { IServiceResponse } from '@app/rabbit';

@Controller()
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @MessagePattern(SURVEY_MESSAGE_PATTERNS.CREATE)
  async register(
    @Payload('createDto') createSurveyInstanceDto: CreateSurveyInstanceDto
  ): Promise<IServiceResponse<SurveyMemberInstanceEntity>> {
    const accountCreateResult = this.surveyService.createSurveyMemberInstance(createSurveyInstanceDto)
    return accountCreateResult
  }
}
