import path from "path";
import { LanguageModule } from "@app/language";
import { RabbitModule, RabbitServiceName } from "@app/rabbit";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MulterModule } from "@nestjs/platform-express";
import { PassportModule } from '@nestjs/passport';
import multer from "multer";

import { MemberGatewayController } from "./modules/member/member-gateway.controller";
import { MemberVerificationGatewayController } from "./modules/member/member-verification-gateway.controller";
import { FeedGatewayController } from './modules/feed/feed-gateway.controller';
import { ReactionGatewayController } from './modules/reaction/reaction-gateway.controller';
import { ViolationGatewayController } from './modules/violation/violation-gateway.controller';
import { BookmarkGatewayController } from "./modules/bookmark/bookmark-gateway.controller";
import { StoryDraftGatewayController } from "./modules/story/story-draft-gateway.controller";
import { AccountGatewayController } from "./modules/account/account-gateway.controller";
import { AccountPasswordGatewayController } from "./modules/account/account-password-gateway.controller";

import { getEnvPath } from "@app/common/env/env.helper";
import { JwtStrategy } from '@app/authentication';

import { MailerGatewayController } from "./modules/mailer/mailer-gateway.controller";
import { SurveyGatewayController } from "./modules/survey/survey-gateway.controller";
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
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // AuthenticationModule.register(),
    // PolicyModule,
  ],
  controllers: [
    AccountGatewayController,
    AccountPasswordGatewayController,
    FeedGatewayController,
    MailerGatewayController,
    MemberGatewayController,
    MemberVerificationGatewayController,
    ReactionGatewayController,
    BookmarkGatewayController,
    StoryDraftGatewayController,
    ViolationGatewayController,
    SurveyGatewayController
  ],
  providers: [JwtStrategy],
})
export class GatewayModule { }
