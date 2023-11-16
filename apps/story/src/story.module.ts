import { Module } from "@nestjs/common";
import { RabbitModule, RabbitServiceName } from "@app/rabbit";
import { ConfigModule } from "@nestjs/config";
import { Database, DatabaseModule } from "@app/database";
import { StoryController } from "./controller/story/story.controller";
import { StoryDraftController } from "./controller/story/story.draft.controller";
import { BookmarkController } from "./controller/bookmark/bookmark.controller";
import { ReactionController } from "./controller/reaction/reaction.controller";
import { ViolationController } from "./controller/violation/violation.controller";
import { StoryService } from "./service/story.service";
import { StoryDraftService } from "./service/story.draft.service";
import { BookmarkService } from "./service/bookmark.service";
import { ReactionService } from "./service/reaction.service";
import { ViolationService } from "./service/violation.service";
import { StoryEntity } from "./entity/story/story.entity";
import { StorySettingEntity } from "./entity/story/story.setting.entity";
import { StoryResourceEntity } from "./entity/story/story.resource.entity";
import { BookmarkEntity } from "./entity/bookmark/bookmark.entity";
import { ReactionEntity } from "./entity/reaction/reaction.entity";
import { ViolationEntity } from "./entity/violation/violation.entity";

import { getEnvPath } from "@app/common/env/env.helper";
import { MemberEntity } from "apps/member/src/entity/member.entity";
import { MemberModule } from "apps/member/src/member.module";
import { StoryUpdateController } from "./controller/story/story.update.controller";
import { StoryUpdateService } from "./service/story.update.service";

const envFilePath: string = getEnvPath(`${__dirname}/`);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envFilePath
    }),
    DatabaseModule.register(Database.PRIMARY),
    DatabaseModule.forEntity(Database.PRIMARY, [
      StoryEntity,
      StorySettingEntity,
      StoryResourceEntity,
      BookmarkEntity,
      ReactionEntity,
      ViolationEntity,
      MemberEntity
    ]),
    RabbitModule.forServerProxy(RabbitServiceName.STORY),
    MemberModule
  ],
  controllers: [
    StoryController,
    StoryUpdateController,
    StoryDraftController,
    BookmarkController,
    ReactionController,
    ViolationController,
  ],
  providers: [
    StoryService,
    StoryUpdateService,
    StoryDraftService,
    BookmarkService,
    ReactionService,
    ViolationService
  ],
})

export class StoryModule {}

