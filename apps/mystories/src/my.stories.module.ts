import { Module } from "@nestjs/common";
import { MyStoriesService } from "./service/my.stories.service";
import { MyStoriesSaga } from "./my.stories.saga";
import { ConfigModule } from "@nestjs/config";
import { Database, DatabaseModule } from "@app/database";
import { TagEntity } from "../../tag/src/entity/tag.entity";
import { StoryEntity } from "../../story/src/entity/story/story.entity";
import { StoryTagEntity } from "../../story/src/entity/tag/story.tag.entity";
import { StorySettingEntity } from "../../story/src/entity/story/story.setting.entity";


import { MemberEntity } from "../../member/src/entity/member.entity";
import { RabbitModule, RabbitServiceName } from "@app/rabbit";
import { getEnvPath } from "@app/common/env/env.helper";
import { MyStoriesTagService } from "./service/my.stories.tag.service";
import { MyStoriesSettingService } from "./service/my.stories.setting.service";
import { MyStoriesController } from "./my.stories.controller";

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
      MemberEntity
    ]),
    RabbitModule.forServerProxy(RabbitServiceName.MY_STORY)
  ],
  controllers: [MyStoriesController],
  providers: [MyStoriesSaga, MyStoriesService, MyStoriesTagService, MyStoriesSettingService],
 exports:[MyStoriesSaga]
})
export class MyStoriesModule {}
