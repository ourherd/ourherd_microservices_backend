import { Auth, CurrentUser } from '@app/authentication';
import { IServiceResponse, RabbitServiceName } from '@app/rabbit';
import { Body, Controller, Inject, Patch, Post, Param, ParseUUIDPipe } from "@nestjs/common";
import { ClientProxy } from '@nestjs/microservices';
import { IGatewayResponse } from '../../common/interface/gateway.interface';
import { MemberEntity } from 'apps/member/src/entity/member.entity';
import { UpdateMemberDto } from "apps/member/src/dto/update-member.dto";
import { CreateMemberDto } from "apps/member/src/dto/create-member.dto";
import { MEMBER_MESSAGE_PATTERNS } from 'apps/member/src/constant/member-patterns.constants';
import { firstValueFrom } from 'rxjs';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Profile Gateway')
@Controller({
  path: '/profile'
})

export class MemberProfileGatewayController {
  constructor(
    @Inject(RabbitServiceName.MEMBER) private memberService: ClientProxy)
    { }

  @Post('/')
  async createProfile (
    @Body() createDto: CreateMemberDto,
  ) : Promise<IGatewayResponse> {
    const { state, data } = await firstValueFrom(
      this.memberService.send<IServiceResponse<MemberEntity>, { createDto: CreateMemberDto }>
      (
        MEMBER_MESSAGE_PATTERNS.CREATE,
        {
          createDto
        }
      )
    );
    return { state, data };
  };

  @Patch('/:id')
  async updateProfile(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateMemberDto
  ) : Promise<IGatewayResponse> {

    const { state, data } = await firstValueFrom(
      this.memberService.send<IServiceResponse<MemberEntity>, { id: string, updateDto: UpdateMemberDto }>(
        MEMBER_MESSAGE_PATTERNS.UPDATE,
        {
          id,
          updateDto
        }
      )
    );

    return { state, data };
  }


}
