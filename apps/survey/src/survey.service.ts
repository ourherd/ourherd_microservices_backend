import { IServiceResponse } from "@app/rabbit";
import { Injectable, Logger } from "@nestjs/common";
import { SurveyMemberInstanceEntity } from "./entity/survey-member-instances.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Database } from "@app/database";
import {
  SURVEY_MESSAGE_DB_RESPONSE,
  SURVEY_SERVICE,
  SURVEY_STATIC_STATUS,
  SURVEY_STATUS
} from "./constant/survey-patterns.constants";
import { SurveyFinalResponseEntity } from "./entity/survey-final-responses.entity";
import { SubmitSurveyFinalDto } from "./dto/submit-survey-final.survey.dto";
import { SurveyEntity } from "./entity/survey.entity";
import { CreateInstanceSurveyDto } from "./dto/create-instance.survey.dto";

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
  ) {
  }

  async createSurveyMemberInstance(
    member_id: string,
    createDto: CreateInstanceSurveyDto
  ): Promise<IServiceResponse<SurveyMemberInstanceEntity>> {

    try {
      const survey = await this.surveyExist(createDto.type);
      if (survey === null) {
        return {
          state: false,
          data: null,
          message: SURVEY_MESSAGE_DB_RESPONSE.NOT_FOUND
        }
      }

      await this.surveyInstanceUpdate( member_id, createDto.type, SURVEY_STATUS.INCOMPLETED);
      createDto.member_id = member_id;
      createDto.survey_id = survey.id;
      const surveyCreatedData = this.surveyMemberInstanceRepo.create(createDto);
      const surveySavedData = await this.surveyMemberInstanceRepo.save(surveyCreatedData);
      return {
        state: !!surveySavedData,
        data: surveySavedData,
        message: SURVEY_MESSAGE_DB_RESPONSE.CREATED
      }
    } catch (error) {
      this.logger.error("Error create survey instance: ", error);
      return {
        state: false,
        data: error
      }
    }
  }

  async submitSurveyInstance(submitFinalDto: SubmitSurveyFinalDto):
    Promise<IServiceResponse<SurveyMemberInstanceEntity>> {

    try {
      const surveyMemberInstance = await this.surveyMemberInstanceExist( submitFinalDto.survey_member_instance_id );
      if (surveyMemberInstance === null) {
        return {
          state: false,
          data: null,
          message: SURVEY_MESSAGE_DB_RESPONSE.NOT_FOUND
        }
      }

      const score = this.surveyScore(submitFinalDto);
      await this.surveyInstanceUpdate( surveyMemberInstance.member_id, surveyMemberInstance.type,
          SURVEY_STATUS.COMPLETED, score );
      const surveyFinalResponseEntities = this.surveyFinalResponseRepo.create(submitFinalDto.data);
      await this.surveyFinalResponseRepo.save(surveyFinalResponseEntities);

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

  private async surveyExist(survey_type: string): Promise<SurveyEntity> {
    return await this.surveyRepo.findOneBy(
      {
        type: survey_type,
        status: SURVEY_STATIC_STATUS.ACTIVE
      }
    );
  }

  private async surveyMemberInstanceExist(id: string): Promise<SurveyMemberInstanceEntity> {
    return await this.surveyMemberInstanceRepo.findOneBy(
      {
        id: id,
        status: SURVEY_STATUS.STARTED
      }
    );
  }

  private async surveyInstanceUpdate( member_id: string, type: string, status: SURVEY_STATUS, survey_score?:number) {
    await this.surveyMemberInstanceRepo.update(
      { member_id, type, status: SURVEY_STATUS.STARTED },
      { status, survey_score });
  }

  private surveyScore( submitFinalDto: SubmitSurveyFinalDto ): number {
    let total = 0;
    submitFinalDto.data.forEach( dto => {
      total += dto.question_response_scale;
    });
    return total;
  }
}
