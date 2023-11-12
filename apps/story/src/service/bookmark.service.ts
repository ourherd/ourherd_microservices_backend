import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Database } from "@app/database";
import { Repository } from "typeorm";
import { IServiceResponse } from "@app/rabbit";
import { BookmarkEntity } from "../entity/bookmark/bookmark.entity";
import { PostStoryBookmarkDto } from "../dto/bookmark/post.story.bookmark.dto";

@Injectable()
export class StoryBookmarkService {

  private readonly logger = new Logger(StoryBookmarkService.name)
  constructor(
    @InjectRepository(BookmarkEntity, Database.PRIMARY)  private bookmarkRepository: Repository<BookmarkEntity>) {}

  async save( member_id: string, bookmarkDto: PostStoryBookmarkDto ): Promise<IServiceResponse<BookmarkEntity>> {
    this.logger.log('Bookmark Post --> ' + JSON.stringify( bookmarkDto ));
    return await this.createOrCheckBookmark( member_id, bookmarkDto );
  }

  private async createOrCheckBookmark ( member_id: string, bookmarkDto: PostStoryBookmarkDto ):
      Promise<IServiceResponse<BookmarkEntity|null>> {

    let bookmark = await this.bookmarkRepository.findOneBy(
      {
          member_id: member_id,
          story_id: bookmarkDto.story_id
      }
    );

    if ( bookmark === null ) {
      bookmarkDto.member_id = member_id;
      bookmark = await this.bookmarkRepository.create(bookmarkDto);
      const result = await this.bookmarkRepository.save(bookmark);
      return {
        state: !!result,
        data: result,
        message: !!result ? 'CREATED' : 'CREATED_FAILED'
      }
    }

    this.logger.log ('Remove bookmark story --> '+ bookmarkDto.story_id );
    const remove =  await this.bookmarkRepository.remove( bookmark );
    //TODO create a new file for message return db
    return {
      state: false,
      data: remove,
      message: 'REMOVED'
    }

  }


}
