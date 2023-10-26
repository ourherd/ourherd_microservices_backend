import { Controller, Inject, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { IGatewayResponse } from "../../common/interface/gateway.interface";
import { RabbitServiceName } from "@app/rabbit";
import { ClientProxy } from "@nestjs/microservices";

@ApiTags('Feed Module')
@Controller({
  path: '/feed'
})

export class FeedGatewayController {

  constructor(@Inject(RabbitServiceName.FEED) private feedClient: ClientProxy) { }

  @Post('/')
  async feed ( ) : Promise<IGatewayResponse> {

    return {
      state: false,
      data : []
    };
  };

}
