import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions } from '@nestjs/microservices';
import { RABBIT_SERVICE_OPTIONS } from '@app/rabbit';
import { SURVEY_SERVICE, SURVEY_MODULE } from "./constant/survey-patterns.constants";
import { SurveyModule } from './survey.module';

async function bootstrap() {

  let logger = new Logger(SURVEY_SERVICE);
  const app = await NestFactory.create(SurveyModule);
  // * setup
  app.connectMicroservice<MicroserviceOptions>(app.get<MicroserviceOptions>(RABBIT_SERVICE_OPTIONS));
  // * start
  await app.startAllMicroservices();

  logger.log(`🚀 Application { ` + SURVEY_MODULE +` } running 🚀`);

}
bootstrap();
