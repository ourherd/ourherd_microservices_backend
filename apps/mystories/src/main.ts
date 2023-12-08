import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { MyStoriesModule } from './my.stories.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { RABBIT_SERVICE_OPTIONS } from '@app/rabbit';
import { MY_STORIES_MODULE, MY_STORIES_SERVICE } from "./constant/mystories-patterns.constants";

async function bootstrap() {

  let logger = new Logger(MY_STORIES_MODULE);
  const app = await NestFactory.create(MyStoriesModule);
  // * setup
  app.connectMicroservice<MicroserviceOptions>(app.get<MicroserviceOptions>(RABBIT_SERVICE_OPTIONS));
  // * start
  await app.startAllMicroservices();
  logger.log(`🚀 Application { ` + MY_STORIES_SERVICE +` } running 🚀`);

}
bootstrap();
