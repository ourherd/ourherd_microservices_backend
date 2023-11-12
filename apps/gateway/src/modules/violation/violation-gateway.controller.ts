import { Body, Controller, Inject, Post } from "@nestjs/common";
import { VIOLATION_MESSAGE_PATTERNS } from "apps/story/src/constant/violation-patterns.constants";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { IServiceResponse, RabbitServiceName } from "@app/rabbit";
import { firstValueFrom } from "rxjs";
import { ClientProxy } from "@nestjs/microservices";
import { PostViolationDto } from "../../../../story/src/dto/violation/post.violation.dto";
import { IGatewayResponse } from "../../common/interface/gateway.interface";
import { ViolationEntity } from "../../../../story/src/entity/violation/violation.entity";
import { Auth, CurrentMember } from "@app/authentication";

@ApiTags('Story Report Violation Gateway')
@Controller({
  path: '/story/report'
})
export class ViolationGatewayController {

  constructor(@Inject(RabbitServiceName.STORY) private violationClient: ClientProxy) { }

  @Post('/')
  @Auth()
  @ApiOperation({ summary: 'Violation Report Story' })
  @ApiResponse({ status: 201, description: 'Member report violation story' })
  async reportViolationStory (
    @CurrentMember('member_id') member_id: string,
    @Body() violationDto: PostViolationDto,) : Promise<IGatewayResponse> {

    const { state, data } = await firstValueFrom(
      this.violationClient.send<IServiceResponse<ViolationEntity>,
        { member_id: string, violationDto: PostViolationDto }>
      (
        VIOLATION_MESSAGE_PATTERNS.REPORT,
        {
          member_id,
          violationDto
        }
      )
    );
    return { state, data };
  };

}
