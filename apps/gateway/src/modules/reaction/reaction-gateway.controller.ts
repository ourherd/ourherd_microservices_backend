import { Body, Controller, Inject, Post } from "@nestjs/common";
import { REACTION_MESSAGE_PATTERNS } from "apps/story/src/constant/reaction-patterns.constants";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { IServiceResponse, RabbitServiceName } from "@app/rabbit";
import { firstValueFrom } from "rxjs";
import { ClientProxy } from "@nestjs/microservices";
import { PostReactionDto } from "../../../../story/src/dto/reaction/post.reaction.dto";
import { IGatewayResponse } from "../../common/interface/gateway.interface";
import { ReactionEntity } from "../../../../story/src/entity/reaction/reaction.entity";
import { Auth, CurrentMember } from "@app/authentication";

@ApiTags('Story Reaction Gateway')
@Controller({
  path: '/story/reaction'
})
export class ReactionGatewayController {

  constructor(@Inject(RabbitServiceName.STORY) private reactionClient: ClientProxy) { }

  @Post('/')
  @Auth()
  @ApiOperation({ summary: 'React to Story' })
  @ApiResponse({ status: 201, description: "member react to a story" })
  async reactToStory (
    @CurrentMember('member_id') member_id: string,
    @Body() reactionDto: PostReactionDto,) : Promise<IGatewayResponse> {
    const { state, data } = await firstValueFrom(
      this.reactionClient.send<IServiceResponse<ReactionEntity>, { member_id: string, reactionDto: PostReactionDto }>
      (
        REACTION_MESSAGE_PATTERNS.REACT,
        {
          member_id,
          reactionDto
        }
      )
    );
    return { state, data };
  };

}
