import { Module } from '@nestjs/common';
import { StoryController } from './story.controller';
import { StoryService } from './story.service';
import { RabbitModule, RabbitServiceName } from '@app/rabbit';
// import { MemberEntity } from './entity/member.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Database, DatabaseModule } from '@app/database';
import { getEnvPath } from '@app/common/env/env.helper';
import { MemberEntity } from "../../member/src/entity/member.entity";
import { MemberController } from "../../member/src/member.controller";
import { MemberService } from "../../member/src/member.service";
import { IsEmailUserAlreadyExistConstraint } from "@app/common/validation-rules/email-not-registered.rule";

const envFilePath: string = getEnvPath(`${__dirname}/`);
console.log(envFilePath)


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envFilePath
    }),

    DatabaseModule.register(Database.PRIMARY),
    DatabaseModule.forEntity(Database.PRIMARY, [MemberEntity]),
    RabbitModule.forServerProxy(RabbitServiceName.STORY)
  ],
  controllers: [StoryController],
  providers: [StoryService],
})

export class StoryModule {}
