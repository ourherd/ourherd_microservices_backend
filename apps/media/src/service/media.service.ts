import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { StorageResourceEntity } from "../../../storage/src/entity/storage-resource.entity";
import { Database } from "@app/database";
import { Repository } from "typeorm";
import { TranscriptionJob } from "@aws-sdk/client-transcribe";

@Injectable()
export class MediaService {

  constructor(
    private configService: ConfigService,
    @InjectRepository(StorageResourceEntity, Database.PRIMARY) private storageResourceRepository:
      Repository<StorageResourceEntity>
    ) {}

  async getStoryResource(story_id: string): Promise<StorageResourceEntity> {
    return this.storageResourceRepository.findOneBy({
      story_id: story_id
    });
  }

  async updateFileResource(resource: StorageResourceEntity): Promise<void> {

  }

  async updateCaptionResource(resource: StorageResourceEntity, job: TranscriptionJob): Promise<void> {

    resource.has_captions_included = true;
    resource.media_captions_path = job.Subtitles.SubtitleFileUris[0]; // VTT
    resource.media_transcript_path = job.Transcript.RedactedTranscriptFileUri;

    await this.storageResourceRepository.update(
      {
        id: resource.id
      }, resource);
  }

}

