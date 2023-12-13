import { Controller } from "@nestjs/common";
import { MediaTranscribeService } from "./service/media.transcribe.service";
import { EventPattern, Payload } from "@nestjs/microservices";
import { TRANSCRIBE_MESSAGE_PATTERNS } from "./constant/media-patterns.constants";

@Controller()
export class MediaController {

  constructor(private readonly transcribeService: MediaTranscribeService) {}

  @EventPattern(TRANSCRIBE_MESSAGE_PATTERNS.CREATE)
  createdCaptions(@Payload('story_id') story_id: string): Promise<void> {
    return this.transcribeService.textExtraction(story_id)
  }


}
