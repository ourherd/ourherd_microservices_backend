import path from "path";
import { LanguageModule } from "@app/language";
import { RabbitModule, RabbitServiceName } from "@app/rabbit";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MulterModule } from "@nestjs/platform-express";
import { PassportModule } from "@nestjs/passport";
import multer from "multer";

import { MemberGatewayController } from "./modules/member/member-gateway.controller";
import { MemberVerificationGatewayController } from "./modules/member/member-verification-gateway.controller";
import { FeedGatewayController } from "./modules/feed/feed-gateway.controller";
import { ReactionGatewayController } from "./modules/reaction/reaction-gateway.controller";
import { ViolationGatewayController } from "./modules/violation/violation-gateway.controller";
import { BookmarkGatewayController } from "./modules/bookmark/bookmark-gateway.controller";
import { StorySubmitGatewayController } from "./modules/story/story-submit-gateway.controller";
import { StoryDraftGatewayController } from "./modules/story/story-draft-gateway.controller";
import { StoryUpdateGatewayController } from "./modules/story/story-update-gateway.controller";
import { StoryResourceGatewayController } from "./modules/story/story-resource-gateway.controller";
import { StorySettingsGatewayController } from "./modules/story/story-settings-gateway.controller";
import { AccountGatewayController } from "./modules/account/account-gateway.controller";
import { AccountPasswordGatewayController } from "./modules/account/account-password-gateway.controller";
import { SurveyGatewayController } from "./modules/survey/survey-gateway.controller";
import { TagGatewayController } from "./modules/tag/tag-gateway.controller";
import { MyStoriesGatewayController } from "./modules/mystories/mystories-gateway.controller";
import { ModerationGatewayController } from "./modules/moderation/moderation-gateway.controller";

import { StorageModule } from "apps/storage/src/storage.module";
import { FeedModule } from "../../feed/src/feed.module";
import { MyStoriesModule } from "../../mystories/src/my.stories.module";

import { getEnvPath } from "@app/common/env/env.helper";
import { JwtStrategy } from "@app/authentication";

const envFilePath: string = getEnvPath(`${__dirname}/`);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envFilePath
    }),
    LanguageModule.register(
      path.join(__dirname, '../../../static/i18n')
    ),
    MulterModule.register({
      storage: multer.memoryStorage()
    }),

    RabbitModule.forClientProxy(RabbitServiceName.ACCOUNT),
    RabbitModule.forClientProxy(RabbitServiceName.MAILER),
    RabbitModule.forClientProxy(RabbitServiceName.MEMBER),
    RabbitModule.forClientProxy(RabbitServiceName.FEED),
    RabbitModule.forClientProxy(RabbitServiceName.STORY),
    RabbitModule.forClientProxy(RabbitServiceName.STORAGE),
    RabbitModule.forClientProxy(RabbitServiceName.SURVEY),
    RabbitModule.forClientProxy(RabbitServiceName.TAG),
    RabbitModule.forClientProxy(RabbitServiceName.MY_STORY),
    RabbitModule.forClientProxy(RabbitServiceName.MEDIA),
    RabbitModule.forClientProxy(RabbitServiceName.MODERATION),
    PassportModule.register({ defaultStrategy: 'jwt' }),

    FeedModule,
    MyStoriesModule,
    StorageModule
  ],
  controllers: [
    AccountGatewayController,
    AccountPasswordGatewayController,
    FeedGatewayController,
    MyStoriesGatewayController,
    MemberGatewayController,
    MemberVerificationGatewayController,
    ReactionGatewayController,
    BookmarkGatewayController,
    StorySubmitGatewayController,
    StoryDraftGatewayController,
    StoryUpdateGatewayController,
    StoryResourceGatewayController,
    StorySettingsGatewayController,
    ViolationGatewayController,
    SurveyGatewayController,
    TagGatewayController,
    ModerationGatewayController
  ],
  providers: [JwtStrategy],
})
export class GatewayModule { }
