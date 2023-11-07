import path from "path";
import { LanguageModule } from "@app/language";
import { RabbitModule, RabbitServiceName } from "@app/rabbit";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MulterModule } from "@nestjs/platform-express";
import multer from "multer";
import { MemberGatewayController } from "./modules/member/member-gateway.controller";
import { PassportModule } from '@nestjs/passport';
import { FeedGatewayController } from './modules/feed/feed-gateway.controller';
import { ReactionGatewayController } from './modules/reaction/reaction-gateway.controller';
import { StoryBookmarkGatewayController } from "./modules/story/story-bookmark-gateway.controller";
import { StoryDraftGatewayController } from "./modules/story/story-draft-gateway.controller";
import { AccountGatewayController } from "./modules/account/account-gateway.controller";
import { AccountPasswordGatewayController } from "./modules/account/account-password-gateway.controller";

import { getEnvPath } from "@app/common/env/env.helper";
import { JwtStrategy } from '@app/authentication';

import { MailerGatewayController } from "./modules/mailer/mailer-gateway.controller";
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
    RabbitModule.forClientProxy(RabbitServiceName.EMAIL),
    RabbitModule.forClientProxy(RabbitServiceName.MEMBER),
    RabbitModule.forClientProxy(RabbitServiceName.FEED),
    RabbitModule.forClientProxy(RabbitServiceName.STORY),
    RabbitModule.forClientProxy(RabbitServiceName.STORAGE),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // AuthenticationModule.register(),
    // PolicyModule,
  ],
  controllers: [
    AccountGatewayController,
    AccountPasswordGatewayController,
    MailerGatewayController,
    MemberGatewayController,
    FeedGatewayController,
    ReactionGatewayController,
    StoryBookmarkGatewayController,
    StoryDraftGatewayController
  ],
  providers: [JwtStrategy],
})
export class GatewayModule { }
