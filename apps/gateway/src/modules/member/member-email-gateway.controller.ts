import { ApiTags } from "@nestjs/swagger";
import { Controller, Inject, Logger } from "@nestjs/common";
import { MEMBER_SERVICE } from "../../../../member/src/constant/member-patterns.constants";
import { RabbitServiceName } from "@app/rabbit";
import { ClientProxy } from "@nestjs/microservices";

@ApiTags('Member Email Gateway')
@Controller({
  path: '/member/email'
})

export class MemberEmailGatewayController {
  logger = new Logger(MEMBER_SERVICE);

  constructor(
    @Inject(RabbitServiceName.MEMBER) private memberClient: ClientProxy,
    @Inject(RabbitServiceName.EMAIL) private emailClient: ClientProxy
  ) { }


}
