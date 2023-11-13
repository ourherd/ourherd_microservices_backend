import { Body, Controller, Inject, Logger, Post } from "@nestjs/common";
import { IGatewayResponse } from '../../common/interface/gateway.interface';
import { IServiceResponse, RabbitServiceName } from "@app/rabbit";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { firstValueFrom } from "rxjs";
import { ClientProxy } from "@nestjs/microservices";
import { GATEWAY_SERVICE } from "../../constant/gateway-patterns.constants";
import { SURVEY_MESSAGE_PATTERNS } from "apps/survey/src/constant/survey-patterns.constants";
import { CreateDQ5SurveyInstanceDto } from "apps/survey/src/dto/create-DQ5-survey-instance.survey.dto";
import { SurveyMemberInstanceEntity } from "apps/survey/src/entities/survey-member-instances.entity";
import { Auth, CurrentUser } from "@app/authentication";
import { SubmitSurveyFinalDto } from "apps/survey/src/dto/submit-survey-final.survey.dto";
import { CreateLongOnBoardingSurveyInstanceDto } from "apps/survey/src/dto/create-Long-Boarding-survey-instance.survey.dto";
import { CreateShortOnBoardingSurveyInstanceDto } from "apps/survey/src/dto/create-Short-Boarding-survey-instance.survey.dto";

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

  @Post('/start/dq5')
  @Auth()
  @ApiOperation({ summary: 'Create Survey Instance DQ5' })
  @ApiResponse({ status: 200, description: 'create success' })
  async createSurveyDQ5Instance(
    @Body() createDto: CreateDQ5SurveyInstanceDto,
    @CurrentUser('id_member') id_member: string
  ): Promise<IGatewayResponse> {

    let createSurveyResult = await firstValueFrom(
      this.surveyClient.send<IServiceResponse<SurveyMemberInstanceEntity>, { 
        createDto: CreateDQ5SurveyInstanceDto ,
        id_member: string
      }>
        (
          SURVEY_MESSAGE_PATTERNS.CREATE_DQ5,
          {
            createDto,
            id_member
          }
        )
    );

    return createSurveyResult;
  }
  
  @Post('/start/long-onboarding')
  @Auth()
  @ApiOperation({ summary: 'Create Survey Instance Long Survey' })
  @ApiResponse({ status: 200, description: 'create success' })
  async createSurveyLongInstance(
    @Body() createDto: CreateLongOnBoardingSurveyInstanceDto,
    @CurrentUser('id_member') id_member: string
  ): Promise<IGatewayResponse> {

    let createSurveyResult = await firstValueFrom(
      this.surveyClient.send<IServiceResponse<SurveyMemberInstanceEntity>, { 
        createDto: CreateLongOnBoardingSurveyInstanceDto ,
        id_member: string
      }>
        (
          SURVEY_MESSAGE_PATTERNS.CREATE_LONG,
          {
            createDto,
            id_member
          }
        )
    );

    return createSurveyResult;
  }
  
  @Post('/start/short-onboarding')
  @Auth()
  @ApiOperation({ summary: 'Create Survey Instance Short Survey' })
  @ApiResponse({ status: 200, description: 'create success' })
  async createSurveyShortInstance(
    @Body() createDto: CreateShortOnBoardingSurveyInstanceDto,
    @CurrentUser('id_member') id_member: string
  ): Promise<IGatewayResponse> {

    let createSurveyResult = await firstValueFrom(
      this.surveyClient.send<IServiceResponse<SurveyMemberInstanceEntity>, { 
        createDto: CreateShortOnBoardingSurveyInstanceDto ,
        id_member: string
      }>
        (
          SURVEY_MESSAGE_PATTERNS.CREATE_SHORT,
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
