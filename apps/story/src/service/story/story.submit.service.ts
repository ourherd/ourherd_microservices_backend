import { Injectable, Logger } from "@nestjs/common";
import { StoryTagService } from "../tag/story.tag.service";
import { MemberService } from "../../../../member/src/service/member.service";
import { StoryService } from "./story.service";
import { IServiceResponse } from "@app/rabbit";
import { StoryEntity } from "../../entity/story/story.entity";
import { StoryTagEntity } from "../../entity/tag/story.tag.entity";
import { MemberEntity } from "../../../../member/src/entity/member.entity";
import { isEmptyOrNull } from "@app/common/validation-rules/object-validation.rule";
import { StoryStatus, StoryType } from "../../constant/story.enum";
import { StoryUpdateStatusResponseDto } from "../../dto/story/story.update.status.response.dto";

@Injectable()
export class StorySubmitService {

  private readonly logger = new Logger(StorySubmitService.name);

  constructor(
    private readonly storyService: StoryService,
    private readonly storyTagService: StoryTagService,
    private readonly memberService: MemberService
  ) {}

  public async submit (member_id: string, story_id: string ): Promise<IServiceResponse<any>> {

    const hasTags = await this.hasTags(story_id);
    if (!hasTags.state) {
      return hasTags;
    }

    const story = await this.hasStoryContent(member_id, story_id);
    if(!story.state) {
      return story;
    }

    const member = await this.isMemberVerified(member_id);
    if(!member.state) {
      return member;
    }
    this.logger.log('The story status has been updated --> ' + StoryStatus.AWAITING_REVIEW);
    return await this.updateStatus(story.data, StoryStatus.AWAITING_REVIEW);
  }

  private async hasStoryContent ( member_id:string, story_id: string) {

    let response = await this.storyService.getStoryByID(story_id, member_id);
    let noResponse = {
      state: false,
      data: null
    }

    if(!response.state) {
      return response;
    }

    if (isEmptyOrNull(response.data.title)) {
      response = noResponse;
    }

    if ( response.data.story_type === StoryType.TEXT_FREE_FORM ){
      if (isEmptyOrNull(response.data.content)) {
        response = noResponse;
      }
    }

    if ( response.data.story_type === StoryType.TEXT_GUIDED ){
      if (isEmptyOrNull(response.data.content_1) || isEmptyOrNull(response.data.content_2) ||
        isEmptyOrNull(response.data.content_3) || isEmptyOrNull(response.data.content_4) ) {
        response = noResponse;
      }
    }

    return response;
  }

  private async hasTags (story_id: string) : Promise<IServiceResponse<StoryTagEntity>>{
    return await this.storyTagService.tagsByStoryID(story_id);
  }

  private async getStory (member_id: string, story_id: string): Promise<IServiceResponse<StoryEntity>>{
    return await this.storyService.getStoryByID(story_id, member_id);
  }

  private async isMemberVerified ( member_id: string ): Promise<IServiceResponse<MemberEntity>> {
    return await this.memberService.memberVerified(member_id);
  }

  private async updateStatus ( story: StoryEntity, status: StoryStatus ):
    Promise<IServiceResponse<StoryUpdateStatusResponseDto>> {
    const response = await this.storyService.updateStatusStory(story, StoryStatus.AWAITING_REVIEW);
    return {
      state: true,
      data: response
    }
  }
}