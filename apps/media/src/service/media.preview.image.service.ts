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

  async createdImage( story_id: string, story_type: string ){

    const resource = await this.mediaService.getStoryResource(story_id);

    let command = new this.ffmpeg.FfmpegCommand('../shikye_intro1.mp4');
    command.input('../shikye_intro1.mp4').input('../input2.avi').noAudio();

    // command.

  }

}
