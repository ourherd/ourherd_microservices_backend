import { Module } from '@nestjs/common';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { RabbitModule, RabbitServiceName } from '@app/rabbit';
import { MemberEntity } from './entity/member.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Database, DatabaseModule } from '@app/database';
import { getEnvPath } from '@app/common/env/env.helper';
import { IsEmailNotRegistered } from "@app/common/validation-rules/email-not-registered.rule";

const envFilePath: string = getEnvPath(`${__dirname}/`);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envFilePath
    }),

    DatabaseModule.register(Database.PRIMARY),
    DatabaseModule.forEntity(Database.PRIMARY, [MemberEntity]),
    RabbitModule.forServerProxy(RabbitServiceName.MEMBER)
  ],
  controllers: [MemberController],
  providers: [IsEmailNotRegistered, MemberService],
})

export class MemberModule {}
