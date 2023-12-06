import { StoryDto } from "../dto/story.dto";
import { isEmptyOrNull } from "@app/common/validation-rules/object-validation.rule";
import { InjectRepository } from "@nestjs/typeorm";
import { Database } from "@app/database";
import { Repository } from "typeorm";
import { BookmarkEntity } from "../../../story/src/entity/bookmark/bookmark.entity";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class BookmarkService {

  private readonly logger = new Logger(BookmarkService.name);

  constructor(
    @InjectRepository(BookmarkEntity, Database.PRIMARY) private bookmarkRepository: Repository<BookmarkEntity>,
  ) {}

  async getBookmarkByStory (member_id: string, dto: StoryDto): Promise<StoryDto> {

    const bookmark = await this.bookmarkRepository.findBy({
      member_id: member_id,
      story_id: dto.id
    });
    dto.is_saved =  isEmptyOrNull(bookmark) ? false: true;
    return dto;
  }

  async getBookmarkIds (member_id: string): Promise<string[]> {
    const bookmarks = await this.bookmarkRepository.findBy({
      member_id: member_id
    });
    let storyIds: string[] = [];

    bookmarks.forEach(bookmark => {
      storyIds.push(bookmark.story_id)
    });

    return storyIds;
  }


}
