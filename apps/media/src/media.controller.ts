import { Controller } from "@nestjs/common";
import { MediaTranscribeService } from "./service/media.transcribe.service";
import { EventPattern, Payload } from "@nestjs/microservices";
import { MEDIA_MESSAGE_PATTERNS, TRANSCRIBE_MESSAGE_PATTERNS } from "./constant/media-patterns.constants";
import { MediaPreviewImageService } from "./service/media.preview.image.service";

@Controller()
export class MediaController {

  constructor(
    private readonly transcribeService: MediaTranscribeService,
    private readonly previewService: MediaPreviewImageService
  ) {}

  @EventPattern(MEDIA_MESSAGE_PATTERNS.CREATE_IMAGE)
  createdPreviewImage(
    @Payload('story_id') story_id: string,
    @Payload('story_type') story_type: string) {
    return this.previewService.createdImage(story_id, story_type);
  }

  @EventPattern(TRANSCRIBE_MESSAGE_PATTERNS.CREATE)
  createdCaptions(@Payload('story_id') story_id: string): Promise<void> {
    return this.transcribeService.textExtraction(story_id)
  }


}
