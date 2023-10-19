import { Module } from "@nestjs/common";
import { FeedController } from "./feed.controller";
import { FeedService } from "./feed.service";
import { RabbitModule, RabbitServiceName } from "@app/rabbit";
import { ReactionEntity } from "./entity/reaction.entity";
import { ConfigModule } from "@nestjs/config";
import { Database, DatabaseModule } from "@app/database";
import { getEnvPath } from "@app/common/env/env.helper";

const envFilePath: string = getEnvPath(`${__dirname}/`);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envFilePath
    }),
    DatabaseModule.register(Database.PRIMARY),
    DatabaseModule.forEntity(Database.PRIMARY, [ReactionEntity]),
    RabbitModule.forServerProxy(RabbitServiceName.FEED)
  ],
  controllers: [FeedController],
  providers: [FeedService],
})

export class FeedModule {}
