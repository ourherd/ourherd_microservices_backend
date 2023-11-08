import { Module } from "@nestjs/common";
import { RabbitModule, RabbitServiceName } from "@app/rabbit";
import { ConfigModule } from "@nestjs/config";
import { Database, DatabaseModule } from "@app/database";
import { getEnvPath } from "@app/common/env/env.helper";
import { FeedController } from "./controller/feed.controller";
import { ReactionController } from "./controller/reaction.controller";
import { ViolationController } from "./controller/violation.controller";
import { FeedService } from "./service/feed.service";
import { ReactionService } from "./service/reaction.service";
import { ViolationService } from "./service/violation.service";
import { ReactionEntity } from "./entity/reaction.entity";
import { ViolationEntity } from "./entity/violation.entity";

const envFilePath: string = getEnvPath(`${__dirname}/`);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envFilePath
    }),
    DatabaseModule.register(Database.PRIMARY),
    DatabaseModule.forEntity(Database.PRIMARY, [ReactionEntity, ViolationEntity]),
    RabbitModule.forServerProxy(RabbitServiceName.FEED),
  ],
  controllers: [FeedController, ReactionController, ViolationController],
  providers: [FeedService, ReactionService, ViolationService],
})

export class FeedModule {}
