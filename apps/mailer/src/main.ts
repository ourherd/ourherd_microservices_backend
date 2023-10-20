import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { MailerModule } from './mailer.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { RABBIT_SERVICE_OPTIONS } from '@app/rabbit';
import {  MAILER_SERVICE, MAILER_MODULE } from "./constant/mailer-patterns.constants";

async function bootstrap() {

  let logger = new Logger(MAILER_SERVICE);

  const app = await NestFactory.create(MailerModule);
  // * setup
  app.connectMicroservice<MicroserviceOptions>(app.get<MicroserviceOptions>(RABBIT_SERVICE_OPTIONS));
  // * start
  await app.startAllMicroservices();

  logger.log(
    `🚀 { ` + MAILER_MODULE +` } running on port 3020`,
  );

}
bootstrap();
