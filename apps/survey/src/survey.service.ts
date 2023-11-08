import { IServiceResponse } from '@app/rabbit';
import { Injectable, Logger } from '@nestjs/common';
import { SurveyMemberInstanceEntity } from './entities/survey-member-instances.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Database } from '@app/database';
import { CreateSurveyInstanceDto } from './dto/create-survey-instance.survey.dto';
import { SURVEY_MESSAGE_DB_RESPONSE, SURVEY_SERVICE } from './constant/survey-patterns.constants';

@Injectable()
export class SurveyService {
  private logger = new Logger(SURVEY_SERVICE);

  constructor(
    @InjectRepository(SurveyMemberInstanceEntity, Database.PRIMARY) 
    private surveyMemberInstanceEntity: Repository<SurveyMemberInstanceEntity>,
  ) { }
  
  async createSurveyMemberInstance(createDto: CreateSurveyInstanceDto): Promise<IServiceResponse<SurveyMemberInstanceEntity>> {

    const surveyMemberInstance = await this.surveyMemberInstanceEntity.findOneBy(
      {
        survey_id: createDto.survey_id
      }
    );

    if (!!surveyMemberInstance === true) {
      return {
        state: false,
        data: null,
        message: "SURVEY.SURVEY_ID_EXISTING"
      }
    }

    const surveyCreatedData = await this.surveyMemberInstanceEntity.create(createDto)
    const surveySavedData = await this.surveyMemberInstanceEntity.save(surveyCreatedData)


    return {
      state: !!surveySavedData,
      data: surveySavedData,
      message: SURVEY_MESSAGE_DB_RESPONSE.CREATED
    }
  }
}
