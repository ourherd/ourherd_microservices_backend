import { Module } from '@nestjs/common';
import { StoryController } from './controller/story.controller';
import { StoryBookmarkController } from './controller/story.bookmark.controller';
import { StoryService } from './service/story.service';
import { StoryBookmarkService } from './service/story.bookmark.service';
import { RabbitModule, RabbitServiceName } from '@app/rabbit';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Database, DatabaseModule } from '@app/database';
import { StoryEntity } from "./entity/story.entity";
import { StorySettingEntity } from "./entity/story.setting.entity";
import { StoryResourceEntity } from "./entity/story.resource.entity";
import { StoryBookmarkEntity } from "./entity/story.bookmark.entity";

import { getEnvPath } from '@app/common/env/env.helper';

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
      StoryBookmarkEntity
    ]),
    RabbitModule.forServerProxy(RabbitServiceName.STORY)
  ],
  controllers: [StoryController, StoryBookmarkController],
  providers: [StoryService, StoryBookmarkService],
})

export class StoryModule {}
