import { ApiConsumes, ApiTags } from "@nestjs/swagger";
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
import { IServiceResponse, RabbitServiceName } from "@app/rabbit";
import { ClientProxy } from "@nestjs/microservices";
import { FileInterceptor } from "@nestjs/platform-express";
import { IGatewayResponse } from "../../common/interface/gateway.interface";
import { firstValueFrom } from "rxjs";
import { STORY_MESSAGE_PATTERNS } from "../../../../story/src/constant/story-patterns.constants";
import { StoryDraftVideoDto } from "../../../../story/src/dto/story.draft.video.dto";
import { StoryDraftTextFreeformDto } from "../../../../story/src/dto/story.draft.text-freeform.dto";
import { StoryDraftTextGuidedDto } from "../../../../story/src/dto/story.draft.text-guided.dto";
import { StoryEntity } from "../../../../story/src/entity/story.entity";
import {
  StorageResourceDriverType,
  StorageResourceType
} from "../../../../storage/src/interface/storage-resource.interface";

import { v4 } from "uuid";
import { StorageService } from "apps/storage/src/service/storage.service";
import { ParseUploadVideoFilePipe } from "@app/common/pipe/parse-upload-video-file.pipe";


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
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('story_resource'))
  async draftVideo(
    @Body() draftVideoDto: StoryDraftVideoDto,
    @UploadedFile(new ParseUploadVideoFilePipe()) story_resource: Express.Multer.File
  ): Promise<IGatewayResponse> {
    const { data: storyData } = await firstValueFrom(
      this.storyProxy.send<IServiceResponse<StoryEntity>, { draftVideoDto: StoryDraftVideoDto }>
        (
          STORY_MESSAGE_PATTERNS.DRAFT_VIDEO,
          {
            draftVideoDto
          }
        )
    );

    const storageDto = {
      type: StorageResourceType.STORY_VIDEO,
      driver: StorageResourceDriverType.S3,
      story_id: storyData.id,
      id: v4(),
    }

    return await this.storageService.upload(storageDto, story_resource);

  }

  @Post('/text-guided')
  async draftTextGuided(
    @Body() draftGuidedDto: StoryDraftTextGuidedDto)
    : Promise<IGatewayResponse> {
    const { state, data } = await firstValueFrom(
      this.storyProxy.send<IServiceResponse<StoryEntity>, { draftGuidedDto: StoryDraftTextGuidedDto }>
        (
          STORY_MESSAGE_PATTERNS.DRAFT_TEXT_GUIDE,
          {
            draftGuidedDto
          }
        )

    );

    return { state, data };
  }

  @Post('/text-freeform')
  async draftTextFreeForm(@Body() draftFreeFormDto: StoryDraftTextFreeformDto)
    : Promise<IGatewayResponse> {
    const { state, data } = await firstValueFrom(
      this.storyProxy.send<IServiceResponse<StoryEntity>, { draftFreeFormDto: StoryDraftTextFreeformDto }>
        (
          STORY_MESSAGE_PATTERNS.DRAFT_TEXT_FREE_FORM,
          {
            draftFreeFormDto
          }
        )
    );
    return { state, data };
  }


}
