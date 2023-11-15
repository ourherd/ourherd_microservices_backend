import { Module } from '@nestjs/common';
import { MailerController } from './mailer.controller';
import { RabbitModule, RabbitServiceName } from '@app/rabbit';
import { MailSengridModule } from "@app/mail/mail.sengrid.module";
import { ConfigModule } from "@nestjs/config";
import { getEnvPath } from "@app/common/env/env.helper";
import { Database, DatabaseModule } from "@app/database";
import { MailerService } from "./mailer.service";

const envFilePath: string = getEnvPath(`${__dirname}/`);

@Module({

  imports: [
    ConfigModule.forRoot({
      envFilePath: envFilePath
    }),
    DatabaseModule.register(Database.PRIMARY),
    RabbitModule.forServerProxy(RabbitServiceName.MAILER),
    MailSengridModule
  ],
  controllers: [MailerController],
  providers: [MailerService],
})
export class MailerModule {}
