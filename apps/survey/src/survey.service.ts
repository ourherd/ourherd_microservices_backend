import { IServiceResponse } from '@app/rabbit';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { SurveyMemberInstanceEntity } from './entities/survey-member-instances.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Database } from '@app/database';
import { CreateSurveyInstanceDto } from './dto/create-survey-instance.survey.dto';
import { SURVEY_MESSAGE_DB_RESPONSE, SURVEY_SERVICE, SURVEY_STATUS } from './constant/survey-patterns.constants';
import { SurveyFinalResponseEntity } from './entities/survey-final-responses.entity';
import { SubmitSurveyFinalDto } from './dto/submit-survey-final.survey.dto';

@Injectable()
export class SurveyService {
  private logger = new Logger(SURVEY_SERVICE);

  constructor(
    @InjectRepository(SurveyMemberInstanceEntity, Database.PRIMARY)
    private surveyMemberInstanceRepo: Repository<SurveyMemberInstanceEntity>,
    @InjectRepository(SurveyFinalResponseEntity, Database.PRIMARY)
    private surveyFinalResponseRepo: Repository<SurveyFinalResponseEntity>,
  ) { }

  async createSurveyMemberInstance(
    createDto: CreateSurveyInstanceDto,
    id_member: string
    ): Promise<IServiceResponse<SurveyMemberInstanceEntity>> {

    try {
      
      const surveyMemberInstance = await this.surveyMemberInstanceRepo.findOneBy(
        {
          survey_id: createDto.survey_id
        }
        );
        
        if (!!surveyMemberInstance === true) {
          return {
            state: false,
            data: null,
            message: SURVEY_MESSAGE_DB_RESPONSE.ID_EXISTING
          }
        }

        createDto.member_id = id_member
        
        const surveyCreatedData = this.surveyMemberInstanceRepo.create(createDto)
        const surveySavedData = await this.surveyMemberInstanceRepo.save(surveyCreatedData)
        
        return {
          state: !!surveySavedData,
          data: surveySavedData,
          message: SURVEY_MESSAGE_DB_RESPONSE.CREATED
        }
      } catch (error) {

        return {
          state: false,
          data: error
        }

      }
  }

  async submitSurveyInstance(submitFinalDto: SubmitSurveyFinalDto): Promise<IServiceResponse<SurveyMemberInstanceEntity>> {

    try {

      const surveyMemberInstance = await this.surveyMemberInstanceRepo.findOneBy(
        {
          survey_id: submitFinalDto.survey_instance_id
        }
      );

      if (!!surveyMemberInstance === false) {
        return {
          state: false,
          data: null,
          message: SURVEY_MESSAGE_DB_RESPONSE.NOT_FOUND
        }
      }

      await this.surveyMemberInstanceRepo.update(
        {
          survey_id: submitFinalDto.survey_instance_id
        },
        {
          status: SURVEY_STATUS.COMPLETED
        }
      )

      const surveyFinalResponseEntities = this.surveyFinalResponseRepo.create(
        submitFinalDto.data
      )
      await this.surveyFinalResponseRepo.save(surveyFinalResponseEntities)

      return {
        state: !!surveyMemberInstance,
        data: surveyMemberInstance,
        message: SURVEY_MESSAGE_DB_RESPONSE.SUBMITED
      }

    } catch (error) {
      
      return {
        state: false,
        data: error
      }
    
    }
  }
}
