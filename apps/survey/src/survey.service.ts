import { IServiceResponse } from '@app/rabbit';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { SurveyMemberInstanceEntity } from './entities/survey-member-instances.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Database } from '@app/database';
import { CreateDQ5SurveyInstanceDto } from './dto/create-DQ5-survey-instance.survey.dto';
import { SURVEY_MESSAGE_DB_RESPONSE, SURVEY_SERVICE, SURVEY_STATIC_STATUS, SURVEY_STATUS } from './constant/survey-patterns.constants';
import { SurveyFinalResponseEntity } from './entities/survey-final-responses.entity';
import { SubmitSurveyFinalDto } from './dto/submit-survey-final.survey.dto';
import { SurveyEntity } from './entities/survey.entity';
import { CreateLongOnBoardingSurveyInstanceDto } from './dto/create-Long-Boarding-survey-instance.survey.dto';
import { CreateShortOnBoardingSurveyInstanceDto } from './dto/create-Short-Boarding-survey-instance.survey.dto';

@Injectable()
export class SurveyService {
  private logger = new Logger(SURVEY_SERVICE);

  constructor(
    @InjectRepository(SurveyMemberInstanceEntity, Database.PRIMARY)
    private surveyMemberInstanceRepo: Repository<SurveyMemberInstanceEntity>,
    @InjectRepository(SurveyFinalResponseEntity, Database.PRIMARY)
    private surveyFinalResponseRepo: Repository<SurveyFinalResponseEntity>,
    @InjectRepository(SurveyEntity, Database.PRIMARY)
    private surveyRepo: Repository<SurveyEntity>,
  ) { }

  async createSurveyMemberInstance(
    createDto: CreateDQ5SurveyInstanceDto|CreateLongOnBoardingSurveyInstanceDto|CreateShortOnBoardingSurveyInstanceDto,
    id_member: string
  ): Promise<IServiceResponse<SurveyMemberInstanceEntity>> {

    try {

      const survey = await this.surveyRepo.findOneBy(
        {
          id: createDto.survey_id,
          status: SURVEY_STATIC_STATUS.ACTIVE
        }
      );
      //TODO Use logger with meaningful message
      console.log(
        JSON.stringify(survey),
        JSON.stringify(createDto),
      );


      if (!!survey === false) {
        return {
          state: false,
          data: null,
          message: SURVEY_MESSAGE_DB_RESPONSE.NOT_FOUND
        }
      } else if (survey.type !== createDto.type) {
        return {
          state: false,
          data: null,
          message: SURVEY_MESSAGE_DB_RESPONSE.INCORRECT_TYPE
        }
      }

      // TODO emit new event for survey member
      const surveyMemberInstance = await this.surveyMemberInstanceRepo.findOneBy(
        {
          id: createDto.id
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
      this.logger.error("createSurveyMemberInstance: ", error)
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
          survey_id: submitFinalDto.survey_member_instance_id
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
          survey_id: submitFinalDto.survey_member_instance_id
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
      this.logger.error("submitSurveyInstance: ", error)
      return {
        state: false,
        data: error
      }

    }
  }
}
