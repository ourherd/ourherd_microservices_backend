import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Upload } from "@aws-sdk/lib-storage";
import { S3 } from "@aws-sdk/client-s3";
import { CreateStorageResourceDto } from "../../dto/create-storage-resource.dto";
import { StorageResourceRoute, StorageResourceType } from "../../interface/storage-resource.interface";
import { S3Client } from "@aws-sdk/client-s3";
import { IServiceResponse } from "@app/rabbit";

@Injectable()
export class ResourceS3AwsService {

  private readonly logger = new Logger(ResourceS3AwsService.name);

  public region: string;
  public s3: S3Client;

  constructor(private configService: ConfigService) {

    this.region = configService.get<string>('AWS_S3_REGION') || 'eu-west-2';
    this.s3 = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY'),
        secretAccessKey: this.configService.get('AWS_S3_SECRET_KEY'),
      }
    });
  }

  async upload(
    storageDto: CreateStorageResourceDto,
    story_resource: Express.Multer.File
  ): Promise<IServiceResponse<any>> {

    const key = this.s3_media_key(storageDto.resource_type, storageDto.id);
    const upload = new Upload({
      params: {
        Bucket: this.configService.get('AWS_S3_BUCKET'),
        Key: key,
        Body: story_resource.buffer,
      },
      client: this.s3,
      queueSize: 3,
    });

    try {
      upload.on("httpUploadProgress", (progress) => {
        this.logger.log(progress);
      });
      const response = await upload.done();

      return {
        state: true,
        data: {
          response: response,
          key: `${this.configService.get('AWS_S3_ENDPOINT')}/${key}`
        },
      };

    } catch (err) {
      this.logger.error('Cannot save file to s3,', err);
      throw err;
    }
  }

  private s3_media_key(type: string, resource: string): string {

    switch (type) {
      case StorageResourceType.STORY_VIDEO:
        return `${StorageResourceRoute.ROUTE_STORY_VIDEO}/${resource}/original.vid`
      case StorageResourceType.STORY_IMAGE:
        return `${StorageResourceRoute.ROUTE_STORY_IMAGE}/${resource}/original.jpg`
      default:
        return StorageResourceRoute.NO_ROUTE_STORY
    }
  }

  // TODO add stream
  // private async stream_buffer(stream: Readable): Promise<Buffer> {
  //   const chunks = []
  //   return new Promise((resolve, reject) => {
  //     stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
  //     stream.on('error', (err) => reject(err))
  //     stream.on('end', () => resolve(Buffer.concat(chunks)))
  //   })
  // }

}
