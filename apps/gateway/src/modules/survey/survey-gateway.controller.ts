import { Body, Controller, Inject, Logger, Param, ParseUUIDPipe, Post } from "@nestjs/common";
import { IGatewayResponse } from '../../common/interface/gateway.interface';
import { IServiceResponse, RabbitServiceName } from "@app/rabbit";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { firstValueFrom } from "rxjs";
import { ClientProxy } from "@nestjs/microservices";
import { GATEWAY_SERVICE } from "../../constant/gateway-patterns.constants";
import { SURVEY_MESSAGE_PATTERNS } from "apps/survey/src/constant/survey-patterns.constants";
import { CreateDQ5SurveyInstanceDto } from "apps/survey/src/dto/create-DQ5-survey-instance.survey.dto";
import { SurveyMemberInstanceEntity } from "apps/survey/src/entity/survey-member-instances.entity";
import { Auth, CurrentMember } from "@app/authentication";
import { SubmitSurveyFinalDto } from "apps/survey/src/dto/submit-survey-final.survey.dto";
import { CreateLongOnBoardingSurveyInstanceDto } from "apps/survey/src/dto/create-Long-Boarding-survey-instance.survey.dto";
import { CreateShortOnBoardingSurveyInstanceDto } from "apps/survey/src/dto/create-Short-Boarding-survey-instance.survey.dto";
import { CreateInstanceSurveyDto } from "../../../../survey/src/dto/create-instance.survey.dto";

@ApiTags('Survey Gateway')
@ApiBearerAuth()
@Controller({
  path: '/survey'
})

export class SurveyGatewayController {
  private logger = new Logger(GATEWAY_SERVICE);

  constructor(@Inject(RabbitServiceName.SURVEY) private surveyClient: ClientProxy,) { }

  @Post('/start')
  @Auth()
  @ApiOperation({ summary: 'Create Survey Instance' })
  @ApiResponse({ status: 200, description: 'Create Survey Instance' })
  async createSurveyInstance(
    @CurrentMember('member_id') member_id: string,
    @Body() createDto: CreateInstanceSurveyDto): Promise<IGatewayResponse> {

    let survey = await firstValueFrom(
      this.surveyClient.send<IServiceResponse<SurveyMemberInstanceEntity>, {
        member_id: string,
        createDto: CreateInstanceSurveyDto
      }>
      (
        SURVEY_MESSAGE_PATTERNS.START,
        {
          member_id,
          createDto,
        }
      )
    );

    return survey;
  }

  @Post('/submit')
  @Auth()
  @ApiOperation({ summary: 'Submit Final Survey' })
  @ApiResponse({ status: 200, description: "Submit Final Survey with all answers" })
  async submit(
    @Body() submitSurveyFinalDto: SubmitSurveyFinalDto
  ): Promise<IGatewayResponse> {
    const response = await firstValueFrom(
      this.surveyClient.send<IServiceResponse<any>, {
        submitSurveyFinalDto: SubmitSurveyFinalDto
      }>
        (
          SURVEY_MESSAGE_PATTERNS.SUBMIT,
          {
            submitSurveyFinalDto
          }
        )
    );
    return response;
  }

}
