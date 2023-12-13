import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Database } from "@app/database";
import { Repository } from "typeorm";
import {
  GetTranscriptionJobCommand,
  GetTranscriptionJobCommandOutput,
  StartTranscriptionJobCommand,
  TranscribeClient,
  TranscriptionJob
} from "@aws-sdk/client-transcribe";
import { StorageResourceEntity } from "../../../storage/src/entity/storage-resource.entity";
import { v4 } from "uuid";
import { ConfigService } from "@nestjs/config";
import { StorageResourceRoute } from "../../../storage/src/interface/storage-resource.interface";


@Injectable()
export class MediaTranscribeService {

  private SECONDS = 60;
  private logger = new Logger(MediaTranscribeService.name);
  public transcribeConfigClient: TranscribeClient;

  constructor(
    private configService: ConfigService,
    @InjectRepository(StorageResourceEntity, Database.PRIMARY) private storageResourceRepository:
      Repository<StorageResourceEntity>
  ) {}

  async textExtraction (story_id: string):  Promise<void> {

    try {
      const transcribeConfig = {
        region: this.configService.get<string>('AWS_S3_REGION'),
        credentials: {
          accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY'),
          secretAccessKey:  this.configService.get('AWS_S3_SECRET_KEY')
        },
      };

      const resource = await this.getStoryResource(story_id);
      if (resource === null) return

      const transcribeClient = new TranscribeClient(transcribeConfig);
      const transcriptionJobResponse = await this.sendTranscribeJob(transcribeClient , resource);

      const successTranscribe = await this.getTranscribeResult(
        transcribeClient,
        transcriptionJobResponse.TranscriptionJobName,
      );
      this.logger.log('Success Transcribe', successTranscribe );
      await this.updateStoryResource(resource, successTranscribe);

    } catch (e) {
      this.logger.error('Error on text extraction -->' + e);
    }
  }

  private async sendTranscribeJob( client: TranscribeClient, resource: StorageResourceEntity ):
    Promise<TranscriptionJob> {

    try {
      const transcriptionJobName = v4();
      const route = StorageResourceRoute.ROUTE_STORY_VIDEO + '/' + resource.id +'/transcript.json';
      const transcribeCommand = new StartTranscriptionJobCommand({
        TranscriptionJobName: transcriptionJobName,
        LanguageCode: "en-US",
        MediaFormat: "mp4",
        Media: { MediaFileUri: resource.media_resource_path },
        OutputBucketName: 'ourherd-public-dev',
        OutputKey: route,
        Subtitles: {
          Formats: ["vtt"]
        }
      });
      const transcriptionJobResponse = await client.send(transcribeCommand);
      return transcriptionJobResponse.TranscriptionJob;

    } catch (e) {
      this.logger.error('Error on sendTranscribeJob -->' + e);
    }
  }

  private async getTranscribeResult (client: TranscribeClient, transcriptionJobName: string): Promise<TranscriptionJob> {

    const transcribeCommand = new GetTranscriptionJobCommand({
      TranscriptionJobName: transcriptionJobName
    });

    let i = 0;
    let job: GetTranscriptionJobCommandOutput;

    while (i < this.SECONDS) {
      job = await client.send(transcribeCommand);
      const job_status = job['TranscriptionJob']['TranscriptionJobStatus'];
      if (['COMPLETED', 'FAILED'].includes(job_status)) {
        if (job_status === 'COMPLETED') {
          return job['TranscriptionJob'];
        }
      } else {
        this.logger.log(`Waiting for ${transcriptionJobName}. Current status is ${job_status}`);
      }
      i++;
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
    }
  }

  private async getStoryResource(story_id: string): Promise<StorageResourceEntity> {
    return this.storageResourceRepository.findOneBy({
      story_id: story_id
    });
  }

  private async updateStoryResource(resource: StorageResourceEntity, job: TranscriptionJob): Promise<void> {
    resource.media_captions_path = job.Subtitles.SubtitleFileUris[0]; // VTT
    resource.has_captions_included = true;
    //job.Transcript.RedactedTranscriptFileUri // transcript.json
    await this.storageResourceRepository.update(
      {
        id: resource.id
      }, resource);
  }

}
