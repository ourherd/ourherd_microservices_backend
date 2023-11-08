import { DatabaseType } from 'typeorm';
import { Database } from '../interface/database.interface';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { MemberEntity } from 'apps/member/src/entity/member.entity';
import { AccountEntity } from 'apps/account/src/entity/account.entity';
import { AccountDeviceEntity } from 'apps/account/src/entity/account.device.entity';
import { ReactionEntity } from 'apps/feed/src/entity/reaction.entity';
import { StoryEntity } from 'apps/story/src/entity/story.entity';
import { StoryBookmarkEntity } from 'apps/story/src/entity/story.bookmark.entity';
import { MemberVerificationEntity } from 'apps/member/src/entity/member-verification.entity';
import { StorageResourceEntity } from "../../../../apps/storage/src/entity/storage-resource.entity";
import { SurveyMemberInstanceEntity } from 'apps/survey/src/entities/survey-member-instances.entity';

export const DATABASE_CONFIG: Record<Database, { type: DatabaseType, env: string, entities: EntityClassOrSchema[] }> = {
    primary: {
        type: 'postgres',
        env: 'PRIMARY',
        entities: [
            MemberEntity,
            ReactionEntity,
            StoryEntity,
            StoryBookmarkEntity,
            AccountEntity,
            AccountDeviceEntity,
            StorageResourceEntity,
            MemberVerificationEntity,
            SurveyMemberInstanceEntity
        ]
    },
    secondary: {
        type: 'postgres',
        env: 'SECONDARY',
        entities: [
          MemberEntity,
          ReactionEntity,
          StoryEntity,
          StoryBookmarkEntity,
          AccountEntity,
          AccountDeviceEntity,
          StorageResourceEntity,
          MemberVerificationEntity,
          SurveyMemberInstanceEntity
        ]
    }
};
