import { Module } from "@nestjs/common";
import { MemberController } from "./controller/member.controller";
import { MemberMailController } from "./controller/member.mail.controller";
import { MemberService } from "./service/member.service";
import { MemberMailService } from "./service/member.mail.service";
import { RabbitModule, RabbitServiceName } from "@app/rabbit";
import { MemberEntity } from "./entity/member.entity";
import { MemberVerificationEntity } from "./entity/member-verification.entity";
import { ConfigModule } from "@nestjs/config";
import { Database, DatabaseModule } from "@app/database";
import { getEnvPath } from "@app/common/env/env.helper";
import { CognitoModule } from "@libs/cognito";

const envFilePath: string = getEnvPath(`${__dirname}/`);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envFilePath
    }),
    DatabaseModule.register(Database.PRIMARY),
    DatabaseModule.forEntity(Database.PRIMARY, [ MemberEntity, MemberVerificationEntity ]),
    RabbitModule.forServerProxy(RabbitServiceName.MEMBER),
    CognitoModule,
  ],
  controllers: [MemberController, MemberMailController],
  providers: [MemberService, MemberMailService],
})

export class MemberModule {}
