import { ApiConsumes, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  Body,
  Controller,
  Inject,
  Param,
  Patch,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";
import { Auth, CurrentMember } from "@app/authentication";
import { RabbitServiceName } from "@app/rabbit";
import { ClientProxy } from "@nestjs/microservices";
import { FileInterceptor } from "@nestjs/platform-express";
import { IGatewayResponse } from "../../common/interface/gateway.interface";
import { StoryDraftVideoDto } from "../../../../story/src/dto/story/story.draft.video.dto";
import {
  StorageResourceDriverType,
  StorageResourceType
} from "../../../../storage/src/interface/storage-resource.interface";
import { v4 } from "uuid";
import { StorageService } from "apps/storage/src/service/storage.service";
import { ParseUploadVideoFilePipe } from "@app/common/pipe/parse-upload-video-file.pipe";
import { ParseUploadImageFilePipe } from "@app/common/pipe/parse-upload-image-file.pipe";
import { StoryUpdateMediaDto } from "apps/story/src/dto/story/story.update.media.dto";
import { StoryType } from "apps/story/src/constant/story.enum";

@ApiTags('Story Create Gateway')
@Controller({
  path: '/story'
})
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
  }),
)

export class StoryUpdateGatewayController {

  constructor(
    private storageService: StorageService
  ) { }


  @Patch('/resource/:story_id')
  @Auth()
  @ApiOperation({ summary: 'Upload new file for the story' })
  @ApiResponse({ status: 201, description: 'Upload new file for the story' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('story_resource'))
  async draftVideo (
    @CurrentMember('member_id') member_id: string,
    @Body() updateMediaDto: StoryUpdateMediaDto,
    @Param('story_id') story_id: string,
    @UploadedFile(new ParseUploadVideoFilePipe() || new ParseUploadImageFilePipe())
            story_resource: Express.Multer.File
  ) : Promise<IGatewayResponse> {

    let storageResourceType = (updateMediaDto.story_type == StoryType.VIDEO_FREE_FORM
      ? StorageResourceType.STORY_VIDEO : StorageResourceType.STORY_IMAGE)

    const storageDto = {
      file: story_resource,
      type: storageResourceType,
      driver: StorageResourceDriverType.S3,
      story_id: story_id,
      id: v4(),
    }

    return await this.storageService.upload(storageDto, story_resource)

  }

}
