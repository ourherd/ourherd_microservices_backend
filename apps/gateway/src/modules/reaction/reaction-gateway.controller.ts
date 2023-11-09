import { Body, Controller, Inject, Post } from "@nestjs/common";
import { REACTION_MESSAGE_PATTERNS } from "apps/feed/src/constant/reaction-patterns.constants";
import { ApiTags } from "@nestjs/swagger";
import { IServiceResponse, RabbitServiceName } from "@app/rabbit";
import { firstValueFrom } from "rxjs";
import { ClientProxy } from "@nestjs/microservices";
import { PostReactionDto } from "../../../../feed/src/dto/post.reaction.dto";
import { IGatewayResponse } from "../../common/interface/gateway.interface";
import { ReactionEntity } from "../../../../feed/src/entity/reaction.entity";

@ApiTags('Story Reaction Gateway')
@Controller({
  path: '/reaction'
})

export class ReactionGatewayController {

  constructor(@Inject(RabbitServiceName.FEED) private reactionClient: ClientProxy) { }

  @Post('/')
  async reactToStory ( @Body() reactionDto: PostReactionDto,) : Promise<IGatewayResponse> {
    const { state, data } = await firstValueFrom(
      this.reactionClient.send<IServiceResponse<ReactionEntity>, { reactionDto: PostReactionDto }>
      (
        REACTION_MESSAGE_PATTERNS.REACT,
        {
          reactionDto
        }
      )
    );
    return { state, data };
  };

}
