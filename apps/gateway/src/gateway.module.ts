import path from "path";
import { LanguageModule } from "@app/language";
import { RabbitModule, RabbitServiceName } from "@app/rabbit";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MulterModule } from "@nestjs/platform-express";
import multer from "multer";
import { MemberGatewayController } from "./modules/member/member-gateway.controller";
import { MemberProfileGatewayController } from "./modules/member/member-profile-gateway.controller";
import { ReactionGatewayController } from "./modules/reaction/reaction-gateway.controller";
import { FeedGatewayController } from "./modules/feed/feed-gateway.controller";
import { getEnvPath } from "@app/common/env/env.helper";

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
    RabbitModule.forClientProxy(RabbitServiceName.MEMBER),
    RabbitModule.forClientProxy(RabbitServiceName.FEED),
    RabbitModule.forClientProxy(RabbitServiceName.STORY),
    // AuthenticationModule.register(),
    // PolicyModule
  ],
  controllers: [
    MemberGatewayController,
    MemberProfileGatewayController,
    FeedGatewayController,
    ReactionGatewayController
  ]
})
export class GatewayModule { }
