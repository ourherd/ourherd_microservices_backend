import { Module } from "@nestjs/common";
import { AccountController } from "./controllers/account.controller";
import { AccountService } from "./services/account.service";
import { RabbitModule, RabbitServiceName } from "@app/rabbit";
import { ConfigModule } from "@nestjs/config";
import { Database, DatabaseModule } from "@app/database";
import { getEnvPath } from "@app/common/env/env.helper";
import { AccountEntity } from "./entity/account.entity";
import { CognitoModule } from "@libs/cognito";
import { AccountCreatedSaga } from "./saga/account-created.saga";
import { PasswordService } from "./services/password.service";
import { PasswordController } from "./controllers/password.controller";
import { ResetPasswordVerificationEntity } from "./entity/reset-password-verification.entity";
import { MailSengridModule } from "@app/mail/mail.sengrid.module";

const envFilePath: string = getEnvPath(`${__dirname}/`);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envFilePath
    }),
    DatabaseModule.register(Database.PRIMARY),
    DatabaseModule.forEntity(Database.PRIMARY, [
      AccountEntity, 
      ResetPasswordVerificationEntity
    ]),
    RabbitModule.forServerProxy(RabbitServiceName.ACCOUNT),
    RabbitModule.forClientProxy(RabbitServiceName.MEMBER),
    RabbitModule.forClientProxy(RabbitServiceName.MAILER),
    CognitoModule,
    //TODO Refactoring later - emails needs to be send from the domain mailer 
    MailSengridModule
  ],
  controllers: [AccountController, PasswordController],
  providers: [AccountService, PasswordService, AccountCreatedSaga],
})

export class AccountModule {}
