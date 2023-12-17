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
import { MediaService } from "./media.service";


@Injectable()
export class MediaTranscribeService {

  private SECONDS = 60;
  private logger = new Logger(MediaTranscribeService.name);
  public transcribeConfigClient: TranscribeClient;

  constructor(
    private configService: ConfigService,
    private readonly mediaService: MediaService,
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
      // TODO only video
      // TODO if resource exist PROCEED
      const resource = await this.mediaService.getStoryResource(story_id);
      if (resource === null) return
      // TODO if resources table on media_resource_path has an MP4 THEN PROCEED
      //  Otherwise abort operation and LOG the reason

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
        MediaFormat: "mp4", //TODO this needs to come from the resource and we need to make sure the MP4 exists
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

  private async updateStoryResource(resource: StorageResourceEntity, job: TranscriptionJob): Promise<void> {

    resource.has_captions_included = true;
    resource.media_captions_path = job.Subtitles.SubtitleFileUris[0]; // VTT
    resource.media_transcript_path = job.Transcript.RedactedTranscriptFileUri;

    await this.storageResourceRepository.update(
      {
        id: resource.id
      }, resource);
  }

}
