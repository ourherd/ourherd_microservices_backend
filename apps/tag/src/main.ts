import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions } from '@nestjs/microservices';
import { RABBIT_SERVICE_OPTIONS } from '@app/rabbit';
import { TAG_SERVICE, TAG_MODULE } from "./constant/tag-patterns.constants";
import { TagModule } from './tag.module';

async function bootstrap() {

  let logger = new Logger(TAG_SERVICE);
  const app = await NestFactory.create(TagModule);
  // * setup
  app.connectMicroservice<MicroserviceOptions>(app.get<MicroserviceOptions>(RABBIT_SERVICE_OPTIONS));
  // * start
  await app.startAllMicroservices();

  logger.log(`🚀 Application { ` + TAG_MODULE +` } running 🚀`);

}
bootstrap();
