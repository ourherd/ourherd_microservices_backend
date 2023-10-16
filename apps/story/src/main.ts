import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { StoryModule } from './story.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { RABBIT_SERVICE_OPTIONS } from '@app/rabbit';
import { STORY_MODULE, STORY_SERVICE } from "./constant/story-patterns.constants";


async function bootstrap() {

  let logger = new Logger(STORY_MODULE);

  const app = await NestFactory.create(StoryModule);
  // * setup
  app.connectMicroservice<MicroserviceOptions>(app.get<MicroserviceOptions>(RABBIT_SERVICE_OPTIONS));
  // * start
  await app.startAllMicroservices();

  logger.log(
    `🚀 { ` + STORY_SERVICE +` } running on port ` ,
  );

}
bootstrap();
