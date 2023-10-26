import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { RabbitModule, RabbitServiceName } from '@app/rabbit';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Database, DatabaseModule } from '@app/database';
import { getEnvPath } from '@app/common/env/env.helper';
import { AccountEntity } from "./entity/account.entity";
import { PassportModule } from '@nestjs/passport';
import { CognitoModule } from '@libs/cognito';
import { CognitoAuthModule } from '@nestjs-cognito/auth';

const envFilePath: string = getEnvPath(`${__dirname}/`);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envFilePath
    }),
    DatabaseModule.register(Database.PRIMARY),
    DatabaseModule.forEntity(Database.PRIMARY, [AccountEntity]),
    RabbitModule.forServerProxy(RabbitServiceName.ACCOUNT),
    RabbitModule.forClientProxy(RabbitServiceName.MEMBER),
    CognitoModule,
  ],
  controllers: [AccountController],
  providers: [AccountService],
})

export class AccountModule {}
