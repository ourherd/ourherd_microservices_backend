import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class StorySubmitService {

  private readonly logger = new Logger(StorySubmitService.name);

  public async submit (member_id: string, story_id: string ): Promise<any> {

  }


}
