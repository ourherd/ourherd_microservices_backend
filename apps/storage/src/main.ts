import { NestFactory } from "@nestjs/core";
import { StorageModule } from "./storage.module";
import { MicroserviceOptions } from "@nestjs/microservices";
import { RABBIT_SERVICE_OPTIONS } from "@app/rabbit";
import { STORAGE_MODULE, STORAGE_SERVICE } from "./constant/storage-patterns.constant";
import { Logger } from "@nestjs/common";

async function bootstrap() {
  let logger = new Logger(STORAGE_SERVICE);
  const app = await NestFactory.create(StorageModule);
  // * setup
  app.connectMicroservice<MicroserviceOptions>(app.get<MicroserviceOptions>(RABBIT_SERVICE_OPTIONS));
  // * start
  await app.startAllMicroservices();
  logger.log(`🚀 Application { ` + STORAGE_MODULE +` } running 🚀`);

}
bootstrap();
