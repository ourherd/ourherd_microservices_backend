import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AccountModule } from './account.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { RABBIT_SERVICE_OPTIONS } from '@app/rabbit';
import { ACCOUNT_SERVICE, ACCOUNT_MODULE } from "./constant/account-patterns.constants";


async function bootstrap() {

  let logger = new Logger(ACCOUNT_SERVICE);

  const app = await NestFactory.create(AccountModule);
  // * setup
  app.connectMicroservice<MicroserviceOptions>(app.get<MicroserviceOptions>(RABBIT_SERVICE_OPTIONS));
  // * start
  await app.startAllMicroservices();

  logger.log(
    `🚀 { ` + ACCOUNT_MODULE +` } running on port 3020`,
  );

}
bootstrap();
