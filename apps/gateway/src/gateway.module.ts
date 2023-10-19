import path from 'path';
import { LanguageModule } from '@app/language';
import { RabbitModule, RabbitServiceName } from '@app/rabbit';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from '@app/authentication';
import { PolicyModule } from '@app/policy';
import { MulterModule } from '@nestjs/platform-express';
import multer from 'multer';

import { MemberGatewayController } from './modules/member/member-gateway.controller'
import { MemberProfileGatewayController } from './modules/member/member-profile-gateway.controller'


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './env'
    }),
    LanguageModule.register(
      path.join(__dirname, '../../../static/i18n')
    ),
    MulterModule.register({
      storage: multer.memoryStorage()
    }),
    RabbitModule.forClientProxy(RabbitServiceName.MEMBER),
    RabbitModule.forClientProxy(RabbitServiceName.ACCOUNT),
    RabbitModule.forClientProxy(RabbitServiceName.FEED),

    // AuthenticationModule.register(),
    // PolicyModule
  ],
  controllers: [
    MemberGatewayController,
    MemberProfileGatewayController
  ]
})
export class GatewayModule { }
