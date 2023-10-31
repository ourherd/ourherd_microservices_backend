import { Module } from "@nestjs/common";
import { AccountController } from "./controllers/account.controller";
import { AccountService } from "./services/account.service";
import { RabbitModule, RabbitServiceName } from "@app/rabbit";
import { ConfigModule } from "@nestjs/config";
import { Database, DatabaseModule } from "@app/database";
import { getEnvPath } from "@app/common/env/env.helper";
import { AccountEntity } from "./entity/account.entity";
import { CognitoModule } from "@libs/cognito";
import { PasswordService } from "./services/password.service";
import { PasswordController } from "./controllers/password.controller";
import { EmailVerificationEntity } from "./entity/email-verification.entity";

const envFilePath: string = getEnvPath(`${__dirname}/`);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envFilePath
    }),
    DatabaseModule.register(Database.PRIMARY),
    DatabaseModule.forEntity(Database.PRIMARY, [AccountEntity]),
    DatabaseModule.forEntity(Database.PRIMARY, [EmailVerificationEntity]),
    RabbitModule.forServerProxy(RabbitServiceName.ACCOUNT),
    RabbitModule.forClientProxy(RabbitServiceName.MEMBER),
    CognitoModule,
  ],
  controllers: [AccountController, PasswordController],
  providers: [AccountService, PasswordService],
})

export class AccountModule {}
