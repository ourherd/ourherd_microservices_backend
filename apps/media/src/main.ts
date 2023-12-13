import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions } from '@nestjs/microservices';
import { RABBIT_SERVICE_OPTIONS } from '@app/rabbit';
import { MEDIA_SERVICE, MEDIA_MODULE } from "./constant/media-patterns.constants";
import { MediaModule } from './media.module';

async function bootstrap() {

  let logger = new Logger(MEDIA_SERVICE);
  const app = await NestFactory.create(MediaModule);
  // * setup
  app.connectMicroservice<MicroserviceOptions>(app.get<MicroserviceOptions>(RABBIT_SERVICE_OPTIONS));
  // * start
  await app.startAllMicroservices();
  logger.log(`🚀 Application { ` + MEDIA_MODULE +` } running 🚀`);
}
bootstrap();
