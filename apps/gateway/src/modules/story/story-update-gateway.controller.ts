import { ApiConsumes, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  Body,
  Controller,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";
import { Auth } from "@app/authentication";
import { IServiceResponse, RabbitServiceName } from "@app/rabbit";
import { ClientProxy } from "@nestjs/microservices";
import { FileInterceptor } from "@nestjs/platform-express";
import { IGatewayResponse } from "../../common/interface/gateway.interface";
import {
  StorageResourceDriverType,
  StorageResourceType
} from "../../../../storage/src/interface/storage-resource.interface";
import { v4 } from "uuid";
import { StorageService } from "apps/storage/src/service/storage.service";
import { STORY_MESSAGE_PATTERNS } from "apps/story/src/constant/story-patterns.constants";
import { StoryEntity } from "apps/story/src/entity/story/story.entity";
import { StoryUpdateSettingDto } from "apps/story/src/dto/story/story.update.setting.dto";
import { firstValueFrom } from "rxjs";
import { StoryUpdateTextFreeFormDto } from "apps/story/src/dto/story/story.update.text-freeform.dto";
import { StoryUpdateTextGuidedDto } from "apps/story/src/dto/story/story.update.text-guided.dto";
import { StoryUpdateVideoDto } from "apps/story/src/dto/story/story.update.video.dto";
import { CreateStorageResourceDto } from "apps/storage/src/dto/create-storage-resource.dto";
import { ParseUploadImageVideoFilePipe } from "@app/common/pipe/parse-upload-image-video-file.pipe";
import { AVAILABLE_UPLOAD_IMAGES_FILE_MIMES } from "@app/common/constant/upload.constant";

@ApiTags('Story Update Gateway')
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
    @Inject(RabbitServiceName.STORY) private storyProxy: ClientProxy,
    private storageService: StorageService
  ) { }


  @Patch('/resource/:story_id')
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

    let storageDto = new CreateStorageResourceDto
    storageDto = {
      resource_type: storageResourceType,
      driver: StorageResourceDriverType.S3,
      story_id: story_id,
      id: v4(),
    }

    return await this.storageService.upload(storageDto, story_resource)

  }

  @Patch('/video/:story_id')
  @Auth()
  @ApiOperation({ summary: 'Story Update (Video Free Form)' })
  @ApiResponse({ status: 201, description: 'Create new Story as update (Video Free Form)' })
  @UseInterceptors(FileInterceptor('story_resource'))
  async updateVideo(
    @Body() updateVideoDto: StoryUpdateVideoDto,
    @Param('story_id', ParseUUIDPipe) story_id: string
  ): Promise<IGatewayResponse> {

    return await firstValueFrom(
      this.storyProxy.send<IServiceResponse<StoryEntity>, { story_id: string, updateVideoDto: StoryUpdateVideoDto }>
        (
          STORY_MESSAGE_PATTERNS.UPDATE_VIDEO,
          {
            story_id,
            updateVideoDto
          }
        )
    );

  }

  @Patch('/text-guided/:story_id')
  @Auth()
  @ApiOperation({ summary: 'Story Update (Guided Text)' })
  @ApiResponse({ status: 201, description: 'Create new Story as update (Guided Text)' })
  async updateTextGuided(
    @Body() updateGuidedDto: StoryUpdateTextGuidedDto,
    @Param('story_id', ParseUUIDPipe) story_id: string
  )
    : Promise<IGatewayResponse> {
    const { state, data } = await firstValueFrom(
      this.storyProxy.send<IServiceResponse<StoryEntity>,
        { story_id: string, updateGuidedDto: StoryUpdateTextGuidedDto }>
        (
          STORY_MESSAGE_PATTERNS.UPDATE_TEXT_GUIDE,
          {
            story_id,
            updateGuidedDto
          })
    );
    return { state, data };
  }

  @Patch('/text-freeform/:story_id')
  @Auth()
  @ApiOperation({ summary: 'Story Update (Free Form Text)' })
  @ApiResponse({ status: 201, description: 'Create new Story as update (Free Form Text) ' })
  async updateTextFreeForm(
    @Body() updateFreeFormDto: StoryUpdateTextFreeFormDto,
    @Param('story_id', ParseUUIDPipe) story_id: string
  )
    : Promise<IGatewayResponse> {
    const { state, data } = await firstValueFrom(
      this.storyProxy.send<IServiceResponse<StoryEntity>,
        { story_id: string, updateFreeFormDto: StoryUpdateTextFreeFormDto }>
        (
          STORY_MESSAGE_PATTERNS.UPDATE_TEXT_FREE_FORM,
          {
            story_id,
            updateFreeFormDto
          }
        )
    );
    return { state, data };
  }

  @Patch('/settings/:story_id')
  @Auth()
  @ApiOperation({ summary: 'Story Update (Free Form Text)' })
  @ApiResponse({ status: 201, description: 'Create new Story as update (Free Form Text) ' })
  async updateSetting(
    @Param('story_id', ParseUUIDPipe) story_id: string,
    @Body() updateSettingDto: StoryUpdateSettingDto
  )
    : Promise<IGatewayResponse> {
    const { state, data } = await firstValueFrom(
      this.storyProxy.send<IServiceResponse<StoryEntity>,
        { story_id: string, updateSettingDto: StoryUpdateSettingDto }>
        (
          STORY_MESSAGE_PATTERNS.UPDATE_SETTING,
          {
            story_id,
            updateSettingDto
          }
        )
    );
    return { state, data };
  }

}
