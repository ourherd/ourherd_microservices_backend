import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Param,
  ParseUUIDPipe,
  Post,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";
import { IServiceResponse, RabbitServiceName } from "@app/rabbit";
import { ClientProxy } from "@nestjs/microservices";
import { Auth, CurrentMember } from "@app/authentication";
import { ModerationEntity } from "../../../../moderation/src/entity/moderation.entity";
import { firstValueFrom } from "rxjs";
import { MODERATION_MESSAGE_PATTERNS } from "../../../../moderation/src/constant/moderation-patterns.constants";
import { Roles } from "@app/authentication/decorator/role.decorator";
import { Role } from "@app/authentication/constant/roles.enum";
import { RegisterAccountDto } from "../../../../account/src/dto/register.account.dto";
import { CreateModerationDto } from "../../../../moderation/src/dto/create-moderation.dto";

@ApiTags('Moderation Gateway')
@Controller({
  path: '/moderation'
})

@UsePipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
  }),
)


export class ModerationGatewayController {

  private readonly logger = new Logger(ModerationGatewayController.name);

  constructor(
    @Inject(RabbitServiceName.MODERATION) private moderationClient: ClientProxy) { }

  @Get('/:story_id')
  @Auth()
  //@Roles([ Role.MODERATOR, Role.ADMIN])
  @ApiResponse({ status: 200, description: 'Get moderation data by story' })
  async getModerationByStory(
    @Param('story_id', ParseUUIDPipe) story_id: string) : Promise<IServiceResponse<ModerationEntity[]>> {

    const { state, data } = await firstValueFrom(
      this.moderationClient.send<IServiceResponse<ModerationEntity[]>,
        { story_id: string }>
      (
        MODERATION_MESSAGE_PATTERNS.BY_STORY,
        {
          story_id
        }
      )
    );
    return { state, data };
  };

  @Auth()
  //@Roles([ Role.MODERATOR, Role.ADMIN])
  @Post('/:story_id')
  async createModerationStory (
    @CurrentMember ('member_id') member_id: string,
    @Param('story_id', ParseUUIDPipe) story_id: string,
    @Body() dto: CreateModerationDto
  ) : Promise<IServiceResponse<any>> {

    const { state, data } = await firstValueFrom(
      this.moderationClient.send<IServiceResponse<any>,
        { member_id: string, story_id: string, dto: CreateModerationDto }>
      (
        MODERATION_MESSAGE_PATTERNS.CREATE,
        {
          member_id,
          story_id,
          dto
        }
      )
    );
    return { state, data };

  }

}
