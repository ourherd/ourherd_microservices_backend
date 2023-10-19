import { DatabaseType } from 'typeorm';
import { Database } from '../interface/database.interface';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { MemberEntity } from 'apps/member/src/entity/member.entity';
import { ReactionEntity } from 'apps/feed/src/entity/reaction.entity';
// import { AccountEntity } from 'apps/account/src/entity/account.entity';
// import { AuthRequestEntity } from "apps/auth/src/entity/auth-request.entity";

export const DATABASE_CONFIG: Record<Database, { type: DatabaseType, env: string, entities: EntityClassOrSchema[] }> = {
    primary: {
        type: 'postgres',
        env: 'PRIMARY',
        entities: [
            MemberEntity,
            ReactionEntity
        ]
    },
    secondary: {
        type: 'postgres',
        env: 'SECONDARY',
        entities: [
            MemberEntity,
            ReactionEntity
        ]
    }
};
