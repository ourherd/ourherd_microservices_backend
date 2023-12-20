import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { StoryModerationService } from "../service/story.moderation.service";
import { ModerationEntity, ModerationStatus } from "../entity/moderation.entity";
import { ModerationService } from "../service/moderation.service";
import { CreateModerationDto } from "../dto/create-moderation.dto";
import { IServiceResponse, RabbitServiceName } from "@app/rabbit";
import { StoryStatus } from "../../../story/src/constant/story.enum";
import { RegisterAccountDto } from "../../../account/src/dto/register.account.dto";
import { MAILER_EVENT_PATTERNS, MAILER_MESSAGE_PATTERNS } from "../../../mailer/src/constant/mailer-patterns.constants";
import { ClientProxy } from "@nestjs/microservices";
import { MemberModerationService } from "../service/member.moderation.service";
import { EmailEnum } from "../../../mailer/src/constant/template-map-constants";

@Injectable()
export class CreatedModerationSaga {

  logger = new Logger(CreatedModerationSaga.name);

  constructor(
    private readonly memberService: MemberModerationService,
    private readonly moderationService: ModerationService,
    private readonly storyService: StoryModerationService,
    @Inject(RabbitServiceName.MAILER) private emailClient: ClientProxy
  ) { }

  async created (member_id: string, story_id: string, dto: CreateModerationDto): Promise<IServiceResponse<ModerationEntity>> {

    const moderation = await this.moderationService.createModeration(member_id, story_id, dto);
    if ( moderation.state ) {
      await this.updateStoryStatus(story_id, moderation.data.status);

      if ( moderation.data.status === ModerationStatus.CO_CREATION ||
        moderation.data.status === ModerationStatus.PUBLISHED ||
        moderation.data.status === ModerationStatus.REJECTED ) {
        // const template =
        await this.sendEmailToMember(story_id, moderation.data.status );
      }
    }
    return moderation;
  }

  private async updateStoryStatus(story_id: string, moderationStatus: string) {
    let status;
    switch(moderationStatus) {
      case ModerationStatus.CO_CREATION:
        status = StoryStatus.CO_CREATION
        break
      case ModerationStatus.PUBLISHED:
        status = StoryStatus.PUBLISHED
        break
      case ModerationStatus.REJECTED:
        status = StoryStatus.DRAFT
        break
    }
    await this.storyService.updateStoryStatus( story_id, status );

  }

  private async sendEmailToMember (story_id: string, moderationStatus: string) {

    const story = await this.storyService.getStory(story_id);
    const member = await this.memberService.getMember(story.data.member_id);
    if (member.state === false) throw new NotFoundException('NotFoundException');

    const email = member.data.email;
    const template = this.getEmailTemplate(moderationStatus);

    this.emailClient.emit<IServiceResponse<String>, { email: string, template: string }>(
      MAILER_EVENT_PATTERNS.EMIT_MODERATION_EMAIL,
      {
        email,
        template
    });
  }

  private getEmailTemplate (moderationStatus: string): string {
    let template;
    switch(moderationStatus) {
      case ModerationStatus.CO_CREATION:
        template = EmailEnum.MODERATION_MESSAGE
        break
      case ModerationStatus.PUBLISHED:
        template = EmailEnum.MODERATION_PUBLISHED
        break
      case ModerationStatus.REJECTED:
        template = EmailEnum.MODERATION_REJECTED
        break
    }
    return template;
  }

}
