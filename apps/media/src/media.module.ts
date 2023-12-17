import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './service/media.service';
import { MediaPreviewImageService } from './service/media.preview.image.service';
import { MediaTranscribeService } from './service/media.transcribe.service';
import { ConfigModule } from "@nestjs/config";
import { Database, DatabaseModule } from "@app/database";
import { FluentFfmpegModule } from "@app/ffmpeg";
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
    FluentFfmpegModule.forRoot(),
    DatabaseModule.register(Database.PRIMARY),
    DatabaseModule.forEntity(Database.PRIMARY, [
      StoryEntity,
      StorageResourceEntity,
    ]),
    RabbitModule.forServerProxy(RabbitServiceName.MEDIA),
  ],
  controllers: [MediaController],
  providers: [MediaTranscribeService, MediaPreviewImageService, MediaService],
})
export class MediaModule {}
