import path from 'path';
import { LanguageModule } from '@app/language';
import { RabbitModule, RabbitServiceName } from '@app/rabbit';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import multer from 'multer';
import { AccountGatewayController } from './modules/account/account-gateway.controller'
import { MemberGatewayController } from './modules/member/member-gateway.controller'
import { MemberProfileGatewayController } from './modules/member/member-profile-gateway.controller'

import { getEnvPath } from '@app/common/env/env.helper';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '@app/authentication';
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
    RabbitModule.forClientProxy(RabbitServiceName.MEMBER),
    RabbitModule.forClientProxy(RabbitServiceName.ACCOUNT),
    RabbitModule.forClientProxy(RabbitServiceName.FEED),
    RabbitModule.forClientProxy(RabbitServiceName.STORY),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // AuthenticationModule.register(),
    // PolicyModule
  ],
  controllers: [
    AccountGatewayController,
    MemberGatewayController,
    MemberProfileGatewayController
  ],
  providers: [JwtStrategy],
})
export class GatewayModule { }
