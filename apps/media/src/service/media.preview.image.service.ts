import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectFluentFfmpeg, Ffmpeg } from "@app/ffmpeg";
import { MediaService } from "./media.service";

@Injectable()
export class MediaPreviewImageService {

  constructor(
    private configService: ConfigService,
    private mediaService : MediaService,
    @InjectFluentFfmpeg() private readonly ffmpeg: Ffmpeg
  ) {}

  async createdImage( story_id: string, story_type: string ): Promise<void> {
    // TODO check if the resource exists
    const resource = await this.mediaService.getStoryResource(story_id);
  }

}
