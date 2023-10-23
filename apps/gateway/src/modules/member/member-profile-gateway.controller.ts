import { Auth, CurrentUser } from '@app/authentication';
import { IServiceResponse, RabbitServiceName } from '@app/rabbit';
import { uuid } from 'uuidv4';
import { Body, Controller, Inject, Patch, Post, Param, ParseUUIDPipe, Logger, UseGuards } from "@nestjs/common";
import { ClientProxy } from '@nestjs/microservices';
import { IGatewayResponse } from '../../common/interface/gateway.interface';
import { MemberEntity } from 'apps/member/src/entity/member.entity';
import { UpdateMemberDto } from "apps/member/src/dto/update-member.dto";
import { CreateMemberDto } from "apps/member/src/dto/create-member.dto";
import { MEMBER_MESSAGE_PATTERNS, MEMBER_SERVICE } from "apps/member/src/constant/member-patterns.constants";
import { firstValueFrom } from 'rxjs';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Profile Gateway')
@Controller({
  path: '/profile'
})

export class MemberProfileGatewayController {

  logger = new Logger(MEMBER_SERVICE);

  constructor( @Inject(RabbitServiceName.MEMBER) private memberService: ClientProxy ) { }

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

  @UseGuards(AuthGuard('jwt'))
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
