import { Module } from "@nestjs/common";
import { MemberController } from "./member.controller";
import { MemberService } from "./member.service";
import { RabbitModule, RabbitServiceName } from "@app/rabbit";
import { MemberEntity } from "./entity/member.entity";
import { ConfigModule } from "@nestjs/config";
import { Database, DatabaseModule } from "@app/database";
import { getEnvPath } from "@app/common/env/env.helper";

const envFilePath: string = getEnvPath(`${__dirname}/`);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envFilePath
    }),
    DatabaseModule.register(Database.PRIMARY),
    DatabaseModule.forEntity(Database.PRIMARY, [MemberEntity]),
    RabbitModule.forServerProxy(RabbitServiceName.MEMBER),

  ],
  controllers: [MemberController],
  providers: [MemberService],
})

export class MemberModule {}
