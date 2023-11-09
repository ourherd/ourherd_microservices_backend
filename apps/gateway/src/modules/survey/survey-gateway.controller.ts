import { Body, Controller, Inject, Logger, Post } from "@nestjs/common";
import { IGatewayResponse } from '../../common/interface/gateway.interface';
import { IServiceResponse, RabbitServiceName } from "@app/rabbit";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { firstValueFrom } from "rxjs";
import { ClientProxy } from "@nestjs/microservices";
import { GATEWAY_SERVICE } from "../../constant/gateway-patterns.constants";
import { SURVEY_MESSAGE_PATTERNS } from "apps/survey/src/constant/survey-patterns.constants";
import { CreateSurveyInstanceDto } from "apps/survey/src/dto/create-survey-instance.survey.dto";
import { SurveyMemberInstanceEntity } from "apps/survey/src/entities/survey-member-instances.entity";
import { Auth, CurrentUser } from "@app/authentication";
import { SubmitSurveyFinalDto } from "apps/survey/src/dto/submit-survey-final.survey.dto";

@ApiTags('Survey Module')
@ApiBearerAuth()
@Controller({
  path: '/survey'
})

export class SurveyGatewayController {
  private logger = new Logger(GATEWAY_SERVICE);

  constructor(
    @Inject(RabbitServiceName.SURVEY) private surveyClient: ClientProxy,
  ) { }

  @Post('/create')
  @Auth()
  @ApiOperation({ summary: 'Create Survey Instance' })
  @ApiResponse({ status: 200, description: 'create success' })
  async register(
    @Body() createDto: CreateSurveyInstanceDto,
    @CurrentUser('id_member') id_member: string
  ): Promise<IGatewayResponse> {

    let createSurveyResult = await firstValueFrom(
      this.surveyClient.send<IServiceResponse<SurveyMemberInstanceEntity>, { 
        createDto: CreateSurveyInstanceDto ,
        id_member: string
      }>
        (
          SURVEY_MESSAGE_PATTERNS.CREATE,
          {
            createDto,
            id_member
          }
        )
    );

    return createSurveyResult;
  }

  @Post('/submit')
  @Auth()
  @ApiOperation({ summary: 'Submit Final Survey' })
  @ApiResponse({ status: 200, description: "subimt all final question answer" })
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
