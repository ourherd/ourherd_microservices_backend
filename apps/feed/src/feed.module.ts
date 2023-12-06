import { Module } from "@nestjs/common";
import { RabbitModule, RabbitServiceName } from "@app/rabbit";
import { ConfigModule } from "@nestjs/config";
import { Database, DatabaseModule } from "@app/database";
import { getEnvPath } from "@app/common/env/env.helper";
import { FeedController } from "./controller/feed.controller";
import { FeedService } from "./service/feed.service";
import { StoryEntity } from "../../story/src/entity/story/story.entity";
import { StoryTagEntity } from "../../story/src/entity/tag/story.tag.entity";
import { StorySettingEntity } from "../../story/src/entity/story/story.setting.entity";
import { BookmarkEntity } from "../../story/src/entity/bookmark/bookmark.entity";
import { ReactionEntity } from "../../story/src/entity/reaction/reaction.entity";
import { MemberEntity } from "../../member/src/entity/member.entity";
import { TagEntity } from "../../tag/src/entity/tag.entity";
import { StorageResourceEntity } from "../../storage/src/entity/storage-resource.entity";
import { BookmarkService } from "./service/bookmark.service";
import { TagService } from "./service/tag.service";
import { ReactionService } from "./service/reaction.service";
import { ResourceService } from "./service/resource.service";
import { SettingService } from "./service/setting.service";
import { StoryService } from "./service/story.service";

const envFilePath: string = getEnvPath(`${__dirname}/`);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envFilePath
    }),
    DatabaseModule.register(Database.PRIMARY),
    DatabaseModule.forEntity(Database.PRIMARY, [
      TagEntity,
      StoryEntity,
      StoryTagEntity,
      StorySettingEntity,
      StorageResourceEntity,
      BookmarkEntity,
      ReactionEntity,
      MemberEntity
    ]),
    RabbitModule.forServerProxy(RabbitServiceName.FEED),
  ],
  controllers: [FeedController],
  providers: [FeedService, BookmarkService, TagService, ReactionService, ResourceService, SettingService, StoryService],
  exports:[FeedService]
})

export class FeedModule {}
