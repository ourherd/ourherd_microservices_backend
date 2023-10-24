import { DatabaseType } from 'typeorm';
import { Database } from '../interface/database.interface';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { MemberEntity } from 'apps/member/src/entity/member.entity';
import { AccountEntity } from 'apps/account/src/entity/account.entity';
import { AccountDeviceEntity } from 'apps/account/src/entity/account.device.entity';
import { ReactionEntity } from 'apps/feed/src/entity/reaction.entity';
// import { AccountEntity } from 'apps/account/src/entity/account.entity';
// import { AuthRequestEntity } from "apps/auth/src/entity/auth-request.entity";

export const DATABASE_CONFIG: Record<Database, { type: DatabaseType, env: string, entities: EntityClassOrSchema[] }> = {
    primary: {
        type: 'postgres',
        env: 'PRIMARY',
        entities: [
            MemberEntity,
            AccountEntity,
            AccountDeviceEntity
            ReactionEntity
        ]
    },
    secondary: {
        type: 'postgres',
        env: 'SECONDARY',
        entities: [
            MemberEntity,
            AccountEntity,
            AccountDeviceEntity
            ReactionEntity
        ]
    }
};
