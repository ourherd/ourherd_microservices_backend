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
import { STORAGE_MESSAGE_PATTERNS } from "../../../../storage/src/constant/storage-patterns.constant";
import { StoryDraftVideoDto } from "../../../../story/src/dto/story/story.draft.video.dto";
import { StoryDraftTextFreeformDto } from "../../../../story/src/dto/story/story.draft.text-freeform.dto";
import { StoryDraftTextGuidedDto } from "../../../../story/src/dto/story/story.draft.text-guided.dto";
import { StoryEntity } from "../../../../story/src/entity/story/story.entity";
import { StorageResourceEntity } from "../../../../storage/src/entity/storage-resource.entity";
import { CreateStorageResourceDto } from "../../../../storage/src/dto/create-storage-resource.dto";
import {
  StorageResourceDriverType,
  StorageResourceType
} from "../../../../storage/src/interface/storage-resource.interface";
import { v4 } from "uuid";

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
  async draftVideo (
    @CurrentMember('member_id') member_id: string,
    @Body() draftVideoDto: StoryDraftVideoDto,
    @UploadedFile() story_resource: Express.Multer.File
  ) : Promise<IGatewayResponse> {

    const { state: storyState, data: storyData } = await firstValueFrom(
      this.storyService.send<IServiceResponse<StoryEntity>, { member_id: string, draftVideoDto: StoryDraftVideoDto }>
      (
        STORY_MESSAGE_PATTERNS.DRAFT_VIDEO,
        {
          member_id,
          draftVideoDto
        }
      )
    );
    //TODO refactor this and move it into saga
    const { state, data } = await firstValueFrom(
      this.storageService.send<IServiceResponse<StorageResourceEntity>,
        { storageDto: CreateStorageResourceDto }>
      (
        STORAGE_MESSAGE_PATTERNS.CREATE,
        {
          storageDto: {
            file: story_resource,
            type: StorageResourceType.STORY_VIDEO,
            driver: StorageResourceDriverType.S3,
            story_id: storyData.id,
            id: v4(),
          }
        }
      )
    );
    return { state, data };
  }

  @Post('/text-guided')
  @Auth()
  @ApiOperation({ summary: 'Story Draft (Guided Text)' })
  @ApiResponse({ status: 201, description: 'Create new Story as draft (Guided Text)' })
  async draftTextGuided (
    @CurrentMember('member_id') member_id: string,
    @Body() draftGuidedDto: StoryDraftTextGuidedDto )
    : Promise<IGatewayResponse>  {
    const { state, data } = await firstValueFrom(
      this.storyService.send<IServiceResponse<StoryEntity>,
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
  async draftTextFreeForm (
    @CurrentMember('member_id') member_id: string,
    @Body() draftFreeFormDto: StoryDraftTextFreeformDto )
    :Promise<IGatewayResponse>  {
    const { state, data } = await firstValueFrom(
      this.storyService.send<IServiceResponse<StoryEntity>,
        { member_id: string, draftFreeFormDto: StoryDraftTextFreeformDto }>
      (
        STORY_MESSAGE_PATTERNS.DRAFT_TEXT_FREE_FORM,
        {
          member_id,
          draftFreeFormDto
        }
      )
    );
    return { state, data };
  }


}
