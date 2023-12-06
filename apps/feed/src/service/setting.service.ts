import { StoryMemberDto } from "../dto/story.member.dto";
import { StoryEntity } from "../../../story/src/entity/story/story.entity";
import { isEmptyOrNull } from "@app/common/validation-rules/object-validation.rule";
import { Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Database } from "@app/database";
import { Repository } from "typeorm";
import { StorySettingEntity } from "../../../story/src/entity/story/story.setting.entity";
import { MemberEntity } from "../../../member/src/entity/member.entity";
import { StoryDto } from "../dto/story.dto";
import { plainToInstance } from "class-transformer";

export class SettingService {

  private readonly logger = new Logger(SettingService.name);

  constructor(
    @InjectRepository(StorySettingEntity, Database.PRIMARY) private storySettingRepository: Repository<StorySettingEntity>,
    @InjectRepository(MemberEntity, Database.PRIMARY)  private memberRepository: Repository<MemberEntity>,
  ) {}

  async getSettingByStory (dto: StoryDto) : Promise<StoryDto> {

    const settings =  await this.storySettingRepository.createQueryBuilder('ss')
      .leftJoinAndSelect(StoryEntity, 's', 'ss.story_id = s.id')
      .andWhere('s.id = :story_id', { story_id: dto.id })
      .getOne();

    let storyMemberDto = plainToInstance(StoryMemberDto, settings);
    storyMemberDto = await this.getStoryMember(dto.id, storyMemberDto);
    dto.settings = storyMemberDto;

    return dto;
  }

  private async getStoryMember (story_id: string, dto: StoryMemberDto) : Promise<StoryMemberDto> {

    const member =  await this.memberRepository.createQueryBuilder('m')
      .leftJoinAndSelect(StoryEntity, 's', 's.member_id = m.id')
      .andWhere('s.id = :story_id', { story_id: story_id })
      .getOne();

    dto.first_name = isEmptyOrNull(member.first_name) ? null : member.first_name;
    dto.country = member.country;
    dto.postal_code =  isEmptyOrNull(member.postal_code)? 0 : Number(member.postal_code);
    dto.suburb =  member.suburb;

    return dto;
  }

}
