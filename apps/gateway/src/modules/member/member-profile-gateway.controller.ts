import { Controller, Get, Logger } from "@nestjs/common";
import { MEMBER_SERVICE } from "apps/member/src/constant/member-patterns.constants";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Profile Module')
@Controller({
  path: '/profile'
})

export class MemberProfileGatewayController {

  logger = new Logger(MEMBER_SERVICE);

  @Get('/me')
  async getProfile() {
    return {
      state: true,
      data: 'profile'
    };
  }

}
