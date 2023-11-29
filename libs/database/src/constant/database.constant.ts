import { DatabaseType } from 'typeorm';
import { Database } from '../interface/database.interface';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { MemberEntity } from 'apps/member/src/entity/member.entity';
import { AccountEntity } from 'apps/account/src/entity/account.entity';
import { AccountDeviceEntity } from 'apps/account/src/entity/account.device.entity';
import { ReactionEntity } from 'apps/story/src/entity/reaction/reaction.entity';
import { StoryEntity } from 'apps/story/src/entity/story/story.entity';
import { StoryTagEntity } from "../../../../apps/story/src/entity/tag/story.tag.entity";
import { BookmarkEntity } from 'apps/story/src/entity/bookmark/bookmark.entity';
import { MemberVerificationEntity } from 'apps/member/src/entity/member-verification.entity';
import { StorageResourceEntity } from "../../../../apps/storage/src/entity/storage-resource.entity";
import { ViolationEntity } from "../../../../apps/story/src/entity/violation/violation.entity";
import { SurveyMemberInstanceEntity } from 'apps/survey/src/entity/survey-member-instances.entity';
import { SurveyFinalResponseEntity } from 'apps/survey/src/entity/survey-final-responses.entity';
import { SurveyEntity } from 'apps/survey/src/entity/survey.entity';
import { StorySettingEntity } from 'apps/story/src/entity/story/story.setting.entity';
import { ResetPasswordVerificationEntity } from 'apps/account/src/entity/reset-password-verification.entity';
import { TagEntity } from "../../../../apps/tag/src/entity/tag.entity";

export const DATABASE_CONFIG: Record<Database, { type: DatabaseType, env: string, entities: EntityClassOrSchema[] }> = {
    primary: {
        type: 'postgres',
        env: 'PRIMARY',
        entities: [
            SurveyMemberInstanceEntity,
            SurveyFinalResponseEntity,
            ResetPasswordVerificationEntity,
            SurveyEntity,
            MemberEntity,
            StorySettingEntity,
            ReactionEntity,
            StoryEntity,
            BookmarkEntity,
            AccountEntity,
            AccountDeviceEntity,
            StorageResourceEntity,
            ViolationEntity,
            MemberVerificationEntity,
            TagEntity,
            StoryTagEntity
        ]
    },
    secondary: {
        type: 'postgres',
        env: 'SECONDARY',
        entities: [
          SurveyMemberInstanceEntity,
          SurveyFinalResponseEntity,
          ResetPasswordVerificationEntity,
          SurveyEntity,
          MemberEntity,
          StorySettingEntity,
          ReactionEntity,
          StoryEntity,
          BookmarkEntity,
          AccountEntity,
          AccountDeviceEntity,
          StorageResourceEntity,
          ViolationEntity,
          MemberVerificationEntity,
          TagEntity,
          StoryTagEntity
        ]
    }
};
