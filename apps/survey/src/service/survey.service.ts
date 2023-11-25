import { IServiceResponse } from "@app/rabbit";
import { Injectable, Logger } from "@nestjs/common";
import { SurveyMemberInstanceEntity } from "../entity/survey-member-instances.entity";
import { Between, Repository, LessThan, MoreThan  } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Database } from "@app/database";
import {
  SURVEY_DQ5_MIN_SCORE, SURVEY_DQ5_WAIT_TIME,
  SURVEY_MESSAGE_DB_RESPONSE,
  SURVEY_SERVICE,
  SURVEY_STATIC_STATUS,
  SURVEY_STATUS
} from "../constant/survey-patterns.constants";
import { SubmitSurveyFinalDto } from "../dto/submit-survey-final.survey.dto";
import { SurveyEntity } from "../entity/survey.entity";
import { CreateInstanceSurveyDto } from "../dto/create-instance.survey.dto";

@Injectable()
export class SurveyService {
  private logger = new Logger(SURVEY_SERVICE);

  constructor(
    @InjectRepository(SurveyMemberInstanceEntity, Database.PRIMARY)
    private surveyMemberInstanceRepo: Repository<SurveyMemberInstanceEntity>,
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

  async completeDQ5SurveyCheck( member_id: string ): Promise<IServiceResponse<SurveyMemberInstanceEntity>> {
     const dq5Valid =  await this.surveyMemberInstanceRepo.createQueryBuilder("survey")
       .where("survey.status= :statusEnum", { statusEnum: SURVEY_STATUS.COMPLETED })
       .where("survey.member_id= :member_id", { member_id: member_id })
       .where("survey.survey_score < :survey_score", { survey_score: SURVEY_DQ5_MIN_SCORE })
       .where("survey.updated_at >= NOW() - :timeframe::INTERVAL", { timeframe: '12 hour' })
       .getOne();
    if (dq5Valid === null){
      return {
        state: false,
        data: null,
        message: SURVEY_MESSAGE_DB_RESPONSE.NOT_DQ5_TO_STORY
      }
    }

    return {
      state: true,
      data: dq5Valid,
      message: SURVEY_MESSAGE_DB_RESPONSE.VALID_DQ5_TO_STORY
    }
   }

  public async surveyExist(survey_type: string): Promise<SurveyEntity> {
    return await this.surveyRepo.findOneBy(
      {
        type: survey_type,
        status: SURVEY_STATIC_STATUS.ACTIVE
      }
    );
  }

  public async surveyMemberInstanceExist(id: string): Promise<SurveyMemberInstanceEntity> {
    return await this.surveyMemberInstanceRepo.findOneBy(
      {
        id: id,
        status: SURVEY_STATUS.STARTED
      }
    );
  }

  public async surveyInstanceUpdate( member_id: string, type: string, status: SURVEY_STATUS, survey_score?:number) {
    await this.surveyMemberInstanceRepo.update(
      { member_id, type, status: SURVEY_STATUS.STARTED },
      { status, survey_score });
  }

  public surveyScore( submitFinalDto: SubmitSurveyFinalDto ): number {
    let total = 0;
    submitFinalDto.data.forEach( dto => {
      total += dto.question_response_scale;
    });
    return total;
  }

}
