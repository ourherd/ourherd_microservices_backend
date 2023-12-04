import { IServiceResponse } from "@app/rabbit";
import { Injectable, Logger } from "@nestjs/common";
import { SurveyMemberInstanceEntity } from "../entity/survey-member-instances.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Database } from "@app/database";
import {
  SURVEY_DQ5_MIN_SCORE,
  SURVEY_MESSAGE_DB_RESPONSE,
  SURVEY_SERVICE,
  SURVEY_STATIC_STATUS,
  SURVEY_STATUS
} from "../constant/survey-patterns.constants";
import { SubmitSurveyFinalDto } from "../dto/submit-survey-final.survey.dto";
import { SurveyEntity } from "../entity/survey.entity";
import { CreateInstanceSurveyDto } from "../dto/create-instance.survey.dto";
import { ConfigService } from "@nestjs/config";
import { isEmptyOrNull } from "@app/common/validation-rules/object-validation.rule";

@Injectable()
export class SurveyService {
  private logger = new Logger(SURVEY_SERVICE);

  constructor(
    private configService: ConfigService,
    @InjectRepository(SurveyMemberInstanceEntity, Database.PRIMARY)
    private surveyMemberInstanceRepo: Repository<SurveyMemberInstanceEntity>,
    @InjectRepository(SurveyEntity, Database.PRIMARY)
    private surveyRepo: Repository<SurveyEntity>,
  ) {
  }

  async createSurveyMemberInstance(
    member_id: string,
    createDto: CreateInstanceSurveyDto
  ): Promise<IServiceResponse<SurveyMemberInstanceEntity|SurveyEntity>> {

    try {
      const survey = await this.surveyExist(createDto.type);
      if (!survey.state) {
        return survey;
      }
      // const survey12Hour = await this.survey12HourInterval(member_id);
      // if (!survey12Hour.state) {
      //   return survey12Hour;
      // }
      await this.surveyInstanceUpdate( member_id, createDto.type, SURVEY_STATUS.INCOMPLETED);
      createDto.member_id = member_id;
      createDto.survey_id = survey.data.id;
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
       .andWhere("survey.member_id= :member_id", { member_id: member_id })
       .andWhere("survey.updated_at >= NOW() - :timeframe::INTERVAL",
         { timeframe: '12 hours' })
       .orderBy('survey.updated_at', 'DESC')
       .getOne();

     if (isEmptyOrNull(dq5Valid)) {
       return {
         state: false,
         data: dq5Valid,
         message: SURVEY_MESSAGE_DB_RESPONSE.NOT_DQ5_TO_STORY
       }
     } else {
       if ( dq5Valid.survey_score >= SURVEY_DQ5_MIN_SCORE  ) {

          return {
            state: dq5Valid.survey_passed,
            data: null,
            message: SURVEY_MESSAGE_DB_RESPONSE.INVALID_SCORE_DQ5_TO_STORY
          }
       } else {

         return {
           state: true,
           data: dq5Valid,
           message: SURVEY_MESSAGE_DB_RESPONSE.VALID_DQ5_TO_STORY
         }
       }
     }

   }

  public async surveyExist(survey_type: string): Promise<IServiceResponse<SurveyEntity|null>> {
    const survey = await this.surveyRepo.findOneBy(
      { type: survey_type, status: SURVEY_STATIC_STATUS.ACTIVE }
    );
    return {
      state: !isEmptyOrNull(survey),
      data: survey,
      message: !isEmptyOrNull(survey) ? SURVEY_MESSAGE_DB_RESPONSE.ID_EXISTING : SURVEY_MESSAGE_DB_RESPONSE.NOT_FOUND
    }
  }

  public async survey12HourInterval(member_id: string): Promise<IServiceResponse<SurveyMemberInstanceEntity|null>>{
    const survey = await this.surveyMemberInstanceRepo.createQueryBuilder("survey")
      .where("survey.member_id= :member_id", { member_id: member_id })
      .andWhere("survey.status= :survey_status", { survey_status: SURVEY_STATUS.COMPLETED })
      .andWhere("survey.created_at >= NOW() - :timeframe::INTERVAL",
        { timeframe: this.configService.get('TIME_TO_WAIT_DQ5') })
      .getOne();
    return {
      state: !isEmptyOrNull(survey),
      data: survey,
      message: !isEmptyOrNull(survey) ?  SURVEY_MESSAGE_DB_RESPONSE.ID_EXISTING: SURVEY_MESSAGE_DB_RESPONSE.NOT_FOUND_12_HOUR
    }
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
    const survey_passed = survey_score < SURVEY_DQ5_MIN_SCORE ? true: false;
    await this.surveyMemberInstanceRepo.update(
      { member_id, type, status: SURVEY_STATUS.STARTED },
      { status, survey_score, survey_passed });
  }

  public surveyScore( submitFinalDto: SubmitSurveyFinalDto ): number {
    let total = 0;
    submitFinalDto.data.forEach( dto => {
      total = total + dto.question_response_scale;
    });
    return total;
  }

}
