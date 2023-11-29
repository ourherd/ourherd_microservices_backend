import {
  Controller,
  Param,
  ParseUUIDPipe,
  Patch,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";
import { StorageService } from "../../../../storage/src/service/storage.service";
import { ApiConsumes, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Auth } from "@app/authentication";
import { FileInterceptor } from "@nestjs/platform-express";
import { ParseUploadImageVideoFilePipe } from "@app/common/pipe/parse-upload-image-video-file.pipe";
import { IGatewayResponse } from "../../common/interface/gateway.interface";
import {
  StorageResourceDriverType,
  StorageResourceType
} from "../../../../storage/src/interface/storage-resource.interface";
import { AVAILABLE_UPLOAD_IMAGES_FILE_MIMES } from "@app/common/constant/upload.constant";
import { CreateStorageResourceDto } from "../../../../storage/src/dto/create-storage-resource.dto";
import { v4 } from "uuid";


@ApiTags('Story Resource Update Gateway')
@Controller({
  path: '/story/resource'
})
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
  }),
)
export class StoryResourceGatewayController {

  constructor(
    private storageService: StorageService
  ) { }

  @Patch('/:story_id')
  @Auth()
  @ApiOperation({ summary: 'Upload new file for the story' })
  @ApiResponse({ status: 201, description: 'Upload new file for the story' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('story_resource'))
  async draftVideo(
    @Param('story_id', ParseUUIDPipe) story_id: string,
    @UploadedFile((new ParseUploadImageVideoFilePipe))
      story_resource: Express.Multer.File
  ): Promise<IGatewayResponse> {
    let storageResourceType: StorageResourceType

    const isImage = AVAILABLE_UPLOAD_IMAGES_FILE_MIMES.some(
      imageMime => story_resource.mimetype.includes(imageMime)
    )

    if (isImage) {
      storageResourceType = StorageResourceType.STORY_IMAGE
    } else {
      storageResourceType = StorageResourceType.STORY_VIDEO
    }

    let storageDto = new CreateStorageResourceDto();
    storageDto = {
      resource_type: storageResourceType,
      driver: StorageResourceDriverType.S3,
      story_id: story_id,
      id: v4(),
    }

    return await this.storageService.upload(storageDto, story_resource)

  }




}
