import { Module } from "@nestjs/common";
import { RabbitModule, RabbitServiceName } from "@app/rabbit";
import { ConfigModule } from "@nestjs/config";
import { Database, DatabaseModule } from "@app/database";
import { StorySubmitController } from "./controller/story/story.submit.controller";
import { StoryDraftController } from "./controller/story/story.draft.controller";
import { BookmarkController } from "./controller/bookmark/bookmark.controller";
import { ReactionController } from "./controller/reaction/reaction.controller";
import { ViolationController } from "./controller/violation/violation.controller";
import { StoryUpdateController } from "./controller/story/story.update.controller";

import { StoryDraftSaga } from "./saga/story.draft.saga";
import { StoryUpdateSaga } from "./saga/story.update.saga";
import { StoryService } from "./service/story/story.service";
import { StorySubmitService } from "./service/story/story.submit.service";
import { StoryDraftService } from "./service/story/story.draft.service";
import { BookmarkService } from "./service/bookmark/bookmark.service";
import { ReactionService } from "./service/reaction/reaction.service";
import { ViolationService } from "./service/violation/violation.service";
import { StoryTagService } from "./service/tag/story.tag.service";
import { StoryUpdateService } from "./service/story/story.update.service";
import { SurveyService } from "../../survey/src/service/survey.service";
import { StorageService } from "../../storage/src/service/storage.service"

import { StoryEntity } from "./entity/story/story.entity";
import { StorySettingEntity } from "./entity/story/story.setting.entity";
import { StoryTagEntity } from "./entity/tag/story.tag.entity";
import { BookmarkEntity } from "./entity/bookmark/bookmark.entity";
import { ReactionEntity } from "./entity/reaction/reaction.entity";
import { ViolationEntity } from "./entity/violation/violation.entity";
import { MemberEntity } from "apps/member/src/entity/member.entity";
import { MemberModule } from "apps/member/src/member.module";
import { SurveyEntity } from "../../survey/src/entity/survey.entity";
import { SurveyMemberInstanceEntity } from "../../survey/src/entity/survey-member-instances.entity";

import { getEnvPath } from "@app/common/env/env.helper";
import { StorageResourceEntity } from "../../storage/src/entity/storage-resource.entity";

const envFilePath: string = getEnvPath(`${__dirname}/`);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envFilePath
    }),
    DatabaseModule.register(Database.PRIMARY),
    DatabaseModule.forEntity(Database.PRIMARY, [
      StoryEntity,
      StoryTagEntity,
      StorySettingEntity,
      BookmarkEntity,
      ReactionEntity,
      ViolationEntity,
      MemberEntity,
      SurveyEntity,
      SurveyMemberInstanceEntity,
    ]),
    RabbitModule.forServerProxy(RabbitServiceName.STORY),
    RabbitModule.forClientProxy(RabbitServiceName.TAG),
    MemberModule
  ],
  controllers: [
    StorySubmitController,
    StoryUpdateController,
    StoryDraftController,
    BookmarkController,
    ReactionController,
    ViolationController,
    StoryUpdateSaga,
  ],
  providers: [
    StoryService,
    StorySubmitService,
    StoryTagService,
    StoryUpdateService,
    StoryDraftService,
    BookmarkService,
    ReactionService,
    ViolationService,
    SurveyService,
    StoryDraftSaga,
    StoryUpdateSaga,
  ],
})

export class StoryModule {}

