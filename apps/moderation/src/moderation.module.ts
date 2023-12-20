import { Module } from '@nestjs/common';
import { ModerationController } from './moderation.controller';
import { ModerationService } from './service/moderation.service';
import { MemberModerationService } from "./service/member.moderation.service";
import { StoryModerationService } from "./service/story.moderation.service";
import { RabbitModule, RabbitServiceName } from '@app/rabbit';
import { ModerationEntity } from './entity/moderation.entity';
import { StoryEntity } from "../../story/src/entity/story/story.entity";
import { MemberEntity } from "../../member/src/entity/member.entity";
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Database, DatabaseModule } from '@app/database';
import { getEnvPath } from '@app/common/env/env.helper';
import { CreatedModerationSaga } from "./saga/created.moderation.saga";

const envFilePath: string = getEnvPath(`${__dirname}/`);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envFilePath
    }),
    DatabaseModule.register(Database.PRIMARY),
    DatabaseModule.forEntity(Database.PRIMARY, [ModerationEntity, StoryEntity, MemberEntity]),
    RabbitModule.forServerProxy(RabbitServiceName.MODERATION),
    RabbitModule.forClientProxy(RabbitServiceName.MAILER)
  ],
  controllers: [ModerationController],
  providers: [ModerationService, MemberModerationService, StoryModerationService, CreatedModerationSaga],
})

export class ModerationModule {}
