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

  //TODO this function gets trigger when we upload a new story with media resource
  // If the image or video has changed we need to update the table resources
  // depending on what type of resource_type we are using.
  async createdImage( story_id: string, resource_type: string ): Promise<void> {
    // TODO check if the resource exists
    const resource = await this.mediaService.getStoryResource(story_id);
    // TODO if resource exist PROCEED
    //  if resource_type is IMAGE = StorageResourceType.STORY_IMAGE do the following with Ffmpeg
    //  from this table field (column) media_original_resource_path get the url and convert this file into jpg and
    //  update table Storage_Resource (added it MediaService - updateFileResource ) to update the following fields
    //  media_resource_path = converted file JPG uri

    // TODO ON THE Table please save converted file JPG like this
    //  image.jpg

    // TODO if resource_type is VIDEO = StorageResourceType.VIDEO do the following with Ffmpeg
    //  from this table field (column) media_original_resource_path get the url and convert this file into MP4 and
    //  from the same mp4 add a frame picture from the video as a media_preview_path (frame second 2)
    //  update table Storage_Resource (added it MediaService - updateFileResource ) to update the following fields
    //  media_resource_path = converted file MP4 uri
    //  ON THE Table please save the new video mp4 like this
    //  video.mp4
    //  ON THE Table please save the preview like this
    //  preview.jpg

  }

}
