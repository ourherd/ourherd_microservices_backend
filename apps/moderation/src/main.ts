import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ModerationModule } from './moderation.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { RABBIT_SERVICE_OPTIONS } from '@app/rabbit';
import { MODERATION_MODULE, MODERATION_SERVICE } from "./constant/moderation-patterns.constants";

async function bootstrap() {

  let logger = new Logger(MODERATION_MODULE);

  const app = await NestFactory.create(ModerationModule);
  // * setup
  app.connectMicroservice<MicroserviceOptions>(app.get<MicroserviceOptions>(RABBIT_SERVICE_OPTIONS));
  // * start
  await app.startAllMicroservices();

  logger.log(`🚀 Application { ` + MODERATION_SERVICE +` } running 🚀`);

}
bootstrap();
