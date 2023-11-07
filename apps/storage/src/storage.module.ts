import { Module } from "@nestjs/common";
import { StorageController } from "./storage.controller";
import { StorageService } from "./service/storage.service";
import { ResourceS3AwsService } from "./service/driver/resource-s3-aws-service";
import { RabbitModule, RabbitServiceName } from "@app/rabbit";
import { Database, DatabaseModule } from "@app/database";
import { StorageResourceEntity } from "./entity/storage-resource.entity";
import { getEnvPath } from "@app/common/env/env.helper";
import { ConfigModule } from "@nestjs/config";

const envFilePath: string = getEnvPath(`${__dirname}/`);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envFilePath
    }),
    DatabaseModule.register(Database.PRIMARY),
    DatabaseModule.forEntity(Database.PRIMARY, [StorageResourceEntity]),
    RabbitModule.forServerProxy(RabbitServiceName.STORAGE)
  ],
  controllers: [StorageController],
  providers: [StorageService, ResourceS3AwsService],
})

export class StorageModule {}
