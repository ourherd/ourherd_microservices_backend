import { ApiConsumes, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  Body,
  Controller,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { Auth, CurrentMember } from "@app/authentication";
import { IServiceResponse, RabbitServiceName } from "@app/rabbit";
import { ClientProxy } from "@nestjs/microservices";
import { FileInterceptor } from "@nestjs/platform-express";
import { IGatewayResponse } from "../../common/interface/gateway.interface";
import { STORY_MESSAGE_PATTERNS } from "../../../../story/src/constant/story-patterns.constants";
import { StoryDraftVideoDto } from "../../../../story/src/dto/story/story.draft.video.dto";
import { StoryDraftTextFreeformDto } from "../../../../story/src/dto/story/story.draft.text-freeform.dto";
import { StoryDraftTextGuidedDto } from "../../../../story/src/dto/story/story.draft.text-guided.dto";
import { StoryEntity } from "../../../../story/src/entity/story/story.entity";
import {
  StorageResourceDriverType,
  StorageResourceType
} from "../../../../storage/src/interface/storage-resource.interface";
import { v4 } from "uuid";
import { StorageService } from "apps/storage/src/service/storage.service";
import { ParseUploadVideoFilePipe } from "@app/common/pipe/parse-upload-video-file.pipe";
import { ParseUploadImageFilePipe } from "@app/common/pipe/parse-upload-image-file.pipe";

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

export class StoryDraftGatewayController {

  constructor(
    @Inject(RabbitServiceName.STORY) private storyProxy: ClientProxy,
    private storageService: StorageService,

  ) { }


  @Post('/video')
  @Auth()
  @ApiOperation({ summary: 'Story Draft (Video Free Form)' })
  @ApiResponse({ status: 201, description: 'Create new Story as draft (Video Free Form)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('story_resource'))
  async draftVideo(
    @CurrentMember('member_id') member_id: string,
    @Body() draftVideoDto: StoryDraftVideoDto,
    @UploadedFile(new ParseUploadVideoFilePipe()) story_resource: Express.Multer.File
  ): Promise<IGatewayResponse> {

    const { state: storyState, data: storyData } = await firstValueFrom(
      this.storyProxy.send<IServiceResponse<StoryEntity>, { member_id: string, draftVideoDto: StoryDraftVideoDto }>
        (
          STORY_MESSAGE_PATTERNS.DRAFT_VIDEO,
          {
            member_id,
            draftVideoDto
          }
        )
    );

    const storageDto = {
      file: story_resource,
      type: StorageResourceType.STORY_VIDEO,
      driver: StorageResourceDriverType.S3,
      story_id: storyData.id,
      id: v4(),
    }

    return await this.storageService.upload(storageDto, story_resource)

  }

  @Post('/text-guided')
  @Auth()
  @ApiOperation({ summary: 'Story Draft (Guided Text)' })
  @ApiResponse({ status: 201, description: 'Create new Story as draft (Guided Text)' })
  async draftTextGuided(
    @CurrentMember('member_id') member_id: string,
    @Body() draftGuidedDto: StoryDraftTextGuidedDto)
    : Promise<IGatewayResponse> {
    const { state, data } = await firstValueFrom(
      this.storyProxy.send<IServiceResponse<StoryEntity>,
        { member_id: string, draftGuidedDto: StoryDraftTextGuidedDto }>
        (
          STORY_MESSAGE_PATTERNS.DRAFT_TEXT_GUIDE,
          {
            member_id,
            draftGuidedDto
          })
    );
    return { state, data };
  }

  @Post('/text-freeform')
  @Auth()
  @ApiOperation({ summary: 'Story Draft (Free Form Text)' })
  @ApiResponse({ status: 201, description: 'Create new Story as draft (Free Form Text) ' })
  @UseInterceptors(FileInterceptor('story_resource'))
  async draftTextFreeForm(
    @CurrentMember('member_id') member_id: string,
    @Body() draftFreeFormDto: StoryDraftTextFreeformDto,
    @UploadedFile(new ParseUploadImageFilePipe()) story_resource: Express.Multer.File
  )
    : Promise<IGatewayResponse> {
    const draftStoryTextFreeForm = await firstValueFrom(
      this.storyProxy.send<IServiceResponse<StoryEntity>,
        { member_id: string, draftFreeFormDto: StoryDraftTextFreeformDto }>
        (
          STORY_MESSAGE_PATTERNS.DRAFT_TEXT_FREE_FORM,
          {
            member_id,
            draftFreeFormDto
          }
        )
    );

    //TODO saga calling both gateway
    const storageDto = {
      file: story_resource,
      type: StorageResourceType.STORY_IMAGE,
      driver: StorageResourceDriverType.S3,
      story_id: draftStoryTextFreeForm.data.id,
      id: v4(),
    }

    return await this.storageService.upload(storageDto, story_resource)
  }


}
