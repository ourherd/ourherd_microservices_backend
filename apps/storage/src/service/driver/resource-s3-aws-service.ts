import _ from "lodash"
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as AWS from "aws-sdk";
import { CreateStorageResourceDto } from "../../dto/create-storage-resource.dto";
import { v4 } from "uuid";
import { StorageResourceRoute, StorageResourceType } from "../../interface/storage-resource.interface";


@Injectable()
export class ResourceS3AwsService {

  private readonly logger = new Logger(ResourceS3AwsService.name);
  public s3: AWS.S3 = new AWS.S3({ apiVersion: '2006-03-01',  signatureVersion: 'v3' });

  constructor(private readonly configService: ConfigService) {
    AWS.config.update({
      region: this.configService.get('AWS_S3_REGION'),
      accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY'),
      secretAccessKey: this.configService.get('AWS_S3_SECRET_KEY'),
    });
  }

  // private s3 = new AWS.S3({
  //   apiVersion: '2006-03-01',
  //  ,
  //   accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY'),
  //   secretAccessKey: this.configService.get('AWS_S3_SECRET_KEY'),
  //   region: this.configService.get('AWS_S3_REGION'),
  // });

  async upload( storageDto: CreateStorageResourceDto, file: Buffer ) {

    let path = this.s3_media_path(storageDto.type, storageDto.id);
    const params = {
      Bucket: this.configService.get('AWS_S3_BUCKET'),
      Key: `${path}`,
      Body: file,
      ContentType: storageDto.file.mimetype,
      ContentDisposition: 'inline'
    };

    try {
      let s3Response = await this.s3.putObject(params).promise()
      return {
        state: true,
        data: {
          response: s3Response,
          key: `${this.configService.get('AWS_S3_ENDPOINT')}/${params.Key}`
        },
      };

    } catch (e) {
      console.log(e);
    }
  }

  private s3_media_path (type: string, resource: string): string {

    switch (type) {
      case StorageResourceType.STORY_VIDEO:
        return `${StorageResourceRoute.ROUTE_STORY_VIDEO}/${resource}/original.mp4`
      case  StorageResourceType.STORY_IMAGE:
        return `${StorageResourceRoute.ROUTE_STORY_IMAGE}/${resource}/original.mp4`
      default:
        return StorageResourceRoute.NO_ROUTE_STORY
    }
  }

}
