import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { MemberModule } from './member.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { RABBIT_SERVICE_OPTIONS } from '@app/rabbit';
import { MEMBER_SERVICE, MEMBER_MODULE } from "./constant/member-patterns.constants";


async function bootstrap() {

  let logger = new Logger(MEMBER_SERVICE);

  const app = await NestFactory.create(MemberModule);
  // * setup
  app.connectMicroservice<MicroserviceOptions>(app.get<MicroserviceOptions>(RABBIT_SERVICE_OPTIONS));
  // * start
  await app.startAllMicroservices();

  logger.log(
    `🚀 { ` + MEMBER_MODULE +` } running on port 3020`,
  );

}
bootstrap();
