import { Module } from "@nestjs/common";
import { RabbitModule, RabbitServiceName } from "@app/rabbit";
import { ConfigModule } from "@nestjs/config";
import { Database, DatabaseModule } from "@app/database";
import { getEnvPath } from "@app/common/env/env.helper";
import { FeedController } from "./controller/feed.controller";
import { FeedService } from "./service/feed.service";

const envFilePath: string = getEnvPath(`${__dirname}/`);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envFilePath
    }),
    DatabaseModule.register(Database.PRIMARY),
    DatabaseModule.forEntity(Database.PRIMARY, []),
    RabbitModule.forServerProxy(RabbitServiceName.FEED),
  ],
  controllers: [FeedController],
  providers: [FeedService],
})

export class FeedModule {}
