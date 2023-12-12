import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions } from '@nestjs/microservices';
import { RABBIT_SERVICE_OPTIONS } from '@app/rabbit';
import { TRANSCRIBE_SERVICE, TRANSCRIBE_MODULE } from "./constant/transcribe-patterns.constants";
import { TranscribeModule } from './transcribe.module';

async function bootstrap() {

  let logger = new Logger(TRANSCRIBE_SERVICE);
  const app = await NestFactory.create(TranscribeModule);
  // * setup
  app.connectMicroservice<MicroserviceOptions>(app.get<MicroserviceOptions>(RABBIT_SERVICE_OPTIONS));
  // * start
  await app.startAllMicroservices();
  logger.log(`🚀 Application { ` + TRANSCRIBE_MODULE +` } running 🚀`);
}
bootstrap();
