import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { FeedModule } from './feed.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { RABBIT_SERVICE_OPTIONS } from '@app/rabbit';
import { FEED_MODULE, FEED_SERVICE } from "./constant/feed-patterns.constants";

async function bootstrap() {

  let logger = new Logger(FEED_MODULE);
  const app = await NestFactory.create(FeedModule);
  // * setup
  app.connectMicroservice<MicroserviceOptions>(app.get<MicroserviceOptions>(RABBIT_SERVICE_OPTIONS));
  // * start
  await app.startAllMicroservices();
  logger.log(`🚀 Application { ` + FEED_SERVICE +` } running 🚀`);

}
bootstrap();
