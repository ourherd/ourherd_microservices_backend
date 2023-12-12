import { Module } from '@nestjs/common';
import { TranscribeController } from './transcribe.controller';
import { TranscribeService } from './transcribe.service';
import { ConfigModule } from "@nestjs/config";
import { Database, DatabaseModule } from "@app/database";
import { StorageResourceEntity } from "../../storage/src/entity/storage-resource.entity";
import { StoryEntity } from "../../story/src/entity/story/story.entity";
import { RabbitModule, RabbitServiceName } from "@app/rabbit";
import { getEnvPath } from "@app/common/env/env.helper";

const envFilePath: string = getEnvPath(`${__dirname}/`);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envFilePath
    }),
    DatabaseModule.register(Database.PRIMARY),
    DatabaseModule.forEntity(Database.PRIMARY, [
      StoryEntity,
      StorageResourceEntity,
    ]),
    RabbitModule.forServerProxy(RabbitServiceName.TRANSCRIBE),
  ],
  controllers: [TranscribeController],
  providers: [TranscribeService],
})
export class TranscribeModule {}
