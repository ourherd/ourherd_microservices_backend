import { Body, Controller, Inject, Post } from "@nestjs/common";
import { VIOLATION_MESSAGE_PATTERNS } from "apps/feed/src/constant/violation-patterns.constants";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { IServiceResponse, RabbitServiceName } from "@app/rabbit";
import { firstValueFrom } from "rxjs";
import { ClientProxy } from "@nestjs/microservices";
import { PostViolationDto } from "../../../../feed/src/dto/post.violation.dto";
import { IGatewayResponse } from "../../common/interface/gateway.interface";
import { ViolationEntity } from "../../../../feed/src/entity/violation.entity";

@ApiTags('Report Violation Gateway')
@Controller({
  path: '/story/report'
})

export class ViolationGatewayController {

  constructor(@Inject(RabbitServiceName.FEED) private violationClient: ClientProxy) { }

  @Post('/')
  @ApiOperation({ summary: 'Violation Report Story' })
  @ApiResponse({ status: 201, description: 'Member report violation story' })
  async reportViolationStory ( @Body() violationDto: PostViolationDto,) : Promise<IGatewayResponse> {
    const { state, data } = await firstValueFrom(
      this.violationClient.send<IServiceResponse<ViolationEntity>, { violationDto: PostViolationDto }>
      (
        VIOLATION_MESSAGE_PATTERNS.REPORT,
        {
          violationDto
        }
      )
    );
    return { state, data };
  };

}
