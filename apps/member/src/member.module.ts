import { Module } from "@nestjs/common";
import { MemberController } from "./controller/member.controller";
import { MemberVerificationController } from "./controller/member.verification.controller";
import { MemberService } from "./service/member.service";
import { MemberVerificationService } from "./service/member.verification.service";
import { RabbitModule, RabbitServiceName } from "@app/rabbit";
import { MemberEntity } from "./entity/member.entity";
import { MemberVerificationEntity } from "./entity/member-verification.entity";
import { ConfigModule } from "@nestjs/config";
import { Database, DatabaseModule } from "@app/database";
import { getEnvPath } from "@app/common/env/env.helper";
import { CognitoModule } from "@libs/cognito";
import { MemberVerifyEmailSentSaga } from "./saga/member-verify-email-sent.saga";

const envFilePath: string = getEnvPath(`${__dirname}/`);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envFilePath
    }),
    DatabaseModule.register(Database.PRIMARY),
    DatabaseModule.forEntity(Database.PRIMARY, [MemberEntity, MemberVerificationEntity]),
    RabbitModule.forServerProxy(RabbitServiceName.MEMBER),
    RabbitModule.forServerProxy(RabbitServiceName.MAILER),
    RabbitModule.forClientProxy(RabbitServiceName.MEMBER),
    RabbitModule.forClientProxy(RabbitServiceName.MAILER),
    CognitoModule,
  ],
  controllers: [MemberController, MemberVerificationController],
  providers: [MemberService, MemberVerificationService, MemberVerifyEmailSentSaga],
})

export class MemberModule {}
