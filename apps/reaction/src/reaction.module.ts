import { Module } from '@nestjs/common';
import { ReactionController } from './reaction.controller';
import { ReactionService } from './reaction.service';
import { RabbitModule, RabbitServiceName } from '@app/rabbit';
import { ReactionEntity } from './entity/reaction.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Database, DatabaseModule } from '@app/database';
import { getEnvPath } from '@app/common/env/env.helper';

const envFilePath: string = getEnvPath(`${__dirname}/`);
console.log(envFilePath)

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envFilePath
    }),
    DatabaseModule.register(Database.PRIMARY),
    DatabaseModule.forEntity(Database.PRIMARY, [ReactionEntity]),
    RabbitModule.forServerProxy(RabbitServiceName.REACTION)
  ],
  controllers: [ReactionController],
  providers: [ReactionService],
})

export class ReactionModule {}
