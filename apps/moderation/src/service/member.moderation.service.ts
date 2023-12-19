import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Database } from "@app/database";
import { Repository } from "typeorm";
import { IServiceResponse } from "@app/rabbit";
import { isEmptyOrNull } from "@app/common/validation-rules/object-validation.rule";
import { MODERATION_STORY_MESSAGE_DB_RESPONSE } from "../constant/moderation-patterns.constants";
import { MemberEntity } from "../../../member/src/entity/member.entity";

@Injectable()
export class MemberModerationService {

  constructor(
    @InjectRepository(MemberEntity, Database.PRIMARY) private memberRepository: Repository<MemberEntity>,
  ) { }

  async getMember(member_id: string): Promise<IServiceResponse<MemberEntity>> {
    const result = await this.memberRepository.findOneBy({
      id: member_id
    });

    if (isEmptyOrNull(result)) {
      return {
        state: false,
        data: null,
        message: MODERATION_STORY_MESSAGE_DB_RESPONSE.MEMBER_NOT_FOUND
      }
    }

    return {
      state: true,
      data: result,
      message: MODERATION_STORY_MESSAGE_DB_RESPONSE.MEMBER_FOUND
    }
  }

}
