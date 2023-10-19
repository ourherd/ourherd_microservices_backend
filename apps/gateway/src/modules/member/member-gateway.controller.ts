import { Controller, Get } from '@nestjs/common';
import { IGatewayResponse } from '../../common/interface/gateway.interface';
import { MemberEntity } from 'apps/member/src/entity/member.entity';
import { Auth, CurrentUser } from "@app/authentication";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('User Gateway')
@Controller({
  path: '/member'
})

// @Auth()
export class MemberGatewayController {

  @Get('/me')
  async getSelf() {
    return {
      state: true,
      data: 'member'
    };
  }
}
