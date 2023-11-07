import { DatabaseType } from 'typeorm';
import { Database } from '../interface/database.interface';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { MemberEntity } from 'apps/member/src/entity/member.entity';
import { AccountEntity } from 'apps/account/src/entity/account.entity';
import { AccountDeviceEntity } from 'apps/account/src/entity/account.device.entity';
import { ReactionEntity } from 'apps/feed/src/entity/reaction.entity';
import { StoryEntity } from 'apps/story/src/entity/story.entity';
import { StoryBookmarkEntity } from 'apps/story/src/entity/story.bookmark.entity';
<<<<<<< HEAD
import { StorageResourceEntity } from "../../../../apps/storage/src/entity/storage-resource.entity";
=======
import { AccountVerificationEntity } from 'apps/account/src/entity/email-verification.entity';
>>>>>>> develop
// import { AccountEntity } from 'apps/account/src/entity/account.entity';
// import { AuthRequestEntity } from "apps/auth/src/entity/auth-request.entity";

export const DATABASE_CONFIG: Record<Database, { type: DatabaseType, env: string, entities: EntityClassOrSchema[] }> = {
    primary: {
        type: 'postgres',
        env: 'PRIMARY',
        entities: [
<<<<<<< HEAD
          MemberEntity,
          ReactionEntity,
          StoryEntity,
          StoryBookmarkEntity,
          AccountEntity,
          AccountDeviceEntity,
          StorageResourceEntity
=======
            MemberEntity,
            ReactionEntity,
            StoryEntity,
            StoryBookmarkEntity,
            AccountEntity,
            AccountDeviceEntity,
            AccountVerificationEntity
>>>>>>> develop
        ]
    },
    secondary: {
        type: 'postgres',
        env: 'SECONDARY',
        entities: [
<<<<<<< HEAD
          MemberEntity,
          ReactionEntity,
          StoryEntity,
          StoryBookmarkEntity,
          AccountEntity,
          AccountDeviceEntity,
          StorageResourceEntity
=======
            MemberEntity,
            ReactionEntity,
            StoryEntity,
            StoryBookmarkEntity,
            AccountEntity,
            AccountDeviceEntity,
            AccountVerificationEntity
>>>>>>> develop
        ]
    }
};
