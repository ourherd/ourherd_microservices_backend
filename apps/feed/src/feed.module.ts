import { Module } from "@nestjs/common";
import { RabbitModule, RabbitServiceName } from "@app/rabbit";
import { ReactionEntity } from "./entity/reaction.entity";
import { ConfigModule } from "@nestjs/config";
import { Database, DatabaseModule } from "@app/database";
import { getEnvPath } from "@app/common/env/env.helper";
import { FeedController } from "./controller/feed.controller";
import { ReactionController } from "./controller/reaction.controller";
import { FeedService } from "./service/feed.service";
import { ReactionService } from "./service/reaction.service";

const envFilePath: string = getEnvPath(`${__dirname}/`);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envFilePath
    }),
    DatabaseModule.register(Database.PRIMARY),
    DatabaseModule.forEntity(Database.PRIMARY, [ReactionEntity]),
    RabbitModule.forServerProxy(RabbitServiceName.FEED),
  ],
  controllers: [FeedController, ReactionController],
  providers: [FeedService, ReactionService],
})

export class FeedModule {}
