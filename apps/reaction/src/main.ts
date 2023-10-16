import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ReactionModule } from './reaction.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { RABBIT_SERVICE_OPTIONS } from '@app/rabbit';
import { REACTION_MODULE, REACTION_SERVICE } from "./constant/reaction-patterns.constants";

async function bootstrap() {

  let logger = new Logger(REACTION_MODULE);

  const app = await NestFactory.create(ReactionModule);
  // * setup
  app.connectMicroservice<MicroserviceOptions>(app.get<MicroserviceOptions>(RABBIT_SERVICE_OPTIONS));
  // * start
  await app.startAllMicroservices();

  logger.log(`🚀 Application { ` + REACTION_SERVICE +` } running 🚀`);

}
bootstrap();
