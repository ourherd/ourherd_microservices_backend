import { Controller, Get } from '@nestjs/common';
import { SurveyService } from './survey.service';

@Controller()
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Get()
  getHello(): string {
    return this.surveyService.getHello();
  }
}
