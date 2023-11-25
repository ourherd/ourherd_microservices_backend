import { Injectable, Logger } from "@nestjs/common";
import { SURVEY_FINAL_SERVICE, SURVEY_MESSAGE_DB_RESPONSE, SURVEY_STATUS } from "../constant/survey-patterns.constants";
import { InjectRepository } from "@nestjs/typeorm";
import { SurveyMemberInstanceEntity } from "../entity/survey-member-instances.entity";
import { Database } from "@app/database";
import { Repository } from "typeorm";
import { SurveyService } from "../service/survey.service";
import { SurveyFinalResponseEntity } from "../entity/survey-final-responses.entity";
import { SubmitSurveyFinalDto } from "../dto/submit-survey-final.survey.dto";
import { IServiceResponse } from "@app/rabbit";

@Injectable()
export class SurveyFinalService {

  private logger = new Logger(SURVEY_FINAL_SERVICE);
  constructor(
    @InjectRepository(SurveyFinalResponseEntity, Database.PRIMARY)
    private surveyFinalResponseRepo: Repository<SurveyFinalResponseEntity>,
    private readonly surveyInstanceService: SurveyService,
  ) {
  }

  async submitSurvey(submitFinalDto: SubmitSurveyFinalDto):
    Promise<IServiceResponse<SurveyMemberInstanceEntity>> {

    try {
      const surveyMemberInstance = await this.surveyInstanceService.
            surveyMemberInstanceExist( submitFinalDto.survey_member_instance_id );
      if (surveyMemberInstance === null) {
        return {
          state: false,
          data: null,
          message: SURVEY_MESSAGE_DB_RESPONSE.NOT_FOUND
        }
      }

      const score = this.surveyInstanceService.surveyScore(submitFinalDto);
      await this.surveyInstanceService.surveyInstanceUpdate(
        surveyMemberInstance.member_id, surveyMemberInstance.type, SURVEY_STATUS.COMPLETED, score );
      const surveyFinalResponseEntities = this.surveyFinalResponseRepo.create(submitFinalDto.data);
      await this.surveyFinalResponseRepo.save(surveyFinalResponseEntities);
      this.logger.log("submit Survey Instance: ", JSON.stringify(surveyFinalResponseEntities));

      return {
        state: !!surveyMemberInstance,
        data: surveyMemberInstance,
        message: SURVEY_MESSAGE_DB_RESPONSE.SUBMITTED
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
