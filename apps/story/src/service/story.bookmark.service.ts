import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Database } from "@app/database";
import { Repository } from "typeorm";
import { IServiceResponse } from "@app/rabbit";
import { StoryBookmarkEntity } from "../entity/story.bookmark.entity";
import { PostStoryBookmarkDto } from "../dto/post.story.bookmark.dto";

@Injectable()
export class StoryBookmarkService {

  private readonly logger = new Logger(StoryBookmarkService.name)
  constructor(
    @InjectRepository(StoryBookmarkEntity, Database.PRIMARY)  private bookmarkRepository: Repository<StoryBookmarkEntity>) {}

  async save(bookmarkDto: PostStoryBookmarkDto): Promise<IServiceResponse<StoryBookmarkEntity>> {
    this.logger.log('Bookmark Post --> ' + JSON.stringify( bookmarkDto ));
    return await this.createOrCheckBookmark( bookmarkDto );
  }

  private async createOrCheckBookmark ( bookmarkDto: PostStoryBookmarkDto ):
      Promise<IServiceResponse<StoryBookmarkEntity|null>> {

    let bookmark = await this.bookmarkRepository.findOneBy(
      {
          member_id: bookmarkDto.member_id,
          story_id: bookmarkDto.story_id
      }
    );

    if ( bookmark === null ) {
      bookmark = await this.bookmarkRepository.create(bookmarkDto);
      const result = await this.bookmarkRepository.save(bookmark);
      return {
        state: !!result,
        data: result,
        message: !!result ? 'CREATED' : 'CREATED_FAILED'
      }
    }

    this.logger.log ('Remove bookmark story --> '+ bookmarkDto.story_id );
    return await this.bookmarkRepository.remove( bookmark );

  }


}
