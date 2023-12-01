import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Database } from "@app/database";
import { StoryEntity } from "../../../story/src/entity/story/story.entity";
import { StorySettingEntity } from "../../../story/src/entity/story/story.setting.entity";
import { MemberEntity } from "../../../member/src/entity/member.entity";
import { ReactionEntity } from "../../../story/src/entity/reaction/reaction.entity";
import { BookmarkEntity } from "../../../story/src/entity/bookmark/bookmark.entity";
import { IPagination } from "@app/common";
import { StoriesListDto } from "../dto/stories.list.dto";
import { IFeedResponse } from "../interface/IFeedResponse";

@Injectable()
export class FeedService {
  private readonly logger = new Logger(FeedService.name)

  constructor(
    @InjectRepository(StoryEntity, Database.PRIMARY) private storyRepository: Repository<StoryEntity>,
    @InjectRepository(BookmarkEntity, Database.PRIMARY) private bookmarkRepository: Repository<BookmarkEntity>,
    @InjectRepository(ReactionEntity, Database.PRIMARY)  private reactionRepository: Repository<ReactionEntity>,
    @InjectRepository(StorySettingEntity, Database.PRIMARY) private storySettingRepository: Repository<StorySettingEntity>,
    @InjectRepository(MemberEntity, Database.PRIMARY)  private memberRepository: Repository<MemberEntity>,
  ) {}

  async getFeed( member_id: string, { page }:StoriesListDto):
                  Promise<IFeedResponse<IPagination<StoryEntity>>> {

    const limit = 10;
    const stories = await this.storyRepository.find({
      skip: (page - 1) * limit,
      take: limit - 1
    });

    const saveStories = await this.saveStories(member_id);

    const storiesCount = await this.storyRepository.count();

    return {
      state: true,
      stories: {
        items: stories,
        limit: limit,
        page: page,
        total: storiesCount
      },
      saved: {
        items:saveStories
      }
    };
  }

  async reactions (member_id: string) :Promise<ReactionEntity[]> {
    try{
      const reaction = await this.reactionRepository.findBy({ member_id: member_id });
      return reaction;
    } catch (e) {

    }
  }

  async saveStories (member_id: string) :Promise<StoryEntity[]> {
    //TODO story creator deletes their story OR deletes their account OR
    // story is made private (taken off public feed)
    try {
      const saves = await this.bookmarkRepository.findBy({ member_id: member_id });
      //forEach()
      let ids: string[] = [];
      for ( const item of saves) {
        ids.push( item.story_id );
      }

      return await this.storyRepository.find({ where: { id: In([...ids]) } });
      // return stories;

    } catch (e) {

    }
  }



}
