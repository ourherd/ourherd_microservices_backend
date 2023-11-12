import { Controller, Logger } from "@nestjs/common";
import { ViolationService } from "../../service/violation.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { IServiceResponse } from "@app/rabbit";
import { PostViolationDto } from "../../dto/violation/post.violation.dto";
import { ViolationEntity } from "../../entity/violation/violation.entity";
import { VIOLATION_MESSAGE_PATTERNS } from "../../constant/violation-patterns.constants";

@Controller()
export class ViolationController {

  constructor(private readonly violationService: ViolationService) {}
  logger = new Logger(ViolationController.name);

  @MessagePattern(VIOLATION_MESSAGE_PATTERNS.REPORT)
  async reaction (
    @Payload('member_id') member_id: string,
    @Payload('violationDto') violationDto: PostViolationDto): Promise<IServiceResponse<ViolationEntity>> {
    return await this.violationService.reportViolationStory(member_id, violationDto);
  }
}
