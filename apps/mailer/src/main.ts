import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { MailerModuleExt } from './mailer.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { RABBIT_SERVICE_OPTIONS } from '@app/rabbit';
import {  MAILER_SERVICE, MAILER_MODULE } from "./constant/mailer-patterns.constants";

async function bootstrap() {

  let logger = new Logger(MAILER_SERVICE);

  const app = await NestFactory.create(MailerModuleExt);
  // * setup
  app.connectMicroservice<MicroserviceOptions>(app.get<MicroserviceOptions>(RABBIT_SERVICE_OPTIONS));
  // * start
  await app.startAllMicroservices();

  logger.log(`🚀 Application { ` + MAILER_MODULE +` } running 🚀`);

}
bootstrap();
