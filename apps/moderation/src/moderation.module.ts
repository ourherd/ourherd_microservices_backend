import { Module } from '@nestjs/common';
import { ModerationController } from './moderation.controller';
import { ModerationService } from './moderation.service';
import { RabbitModule, RabbitServiceName } from '@app/rabbit';
import { ModerationEntity } from './entity/moderation.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Database, DatabaseModule } from '@app/database';
import { getEnvPath } from '@app/common/env/env.helper';

const envFilePath: string = getEnvPath(`${__dirname}/`);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envFilePath
    }),
    DatabaseModule.register(Database.PRIMARY),
    DatabaseModule.forEntity(Database.PRIMARY, [ModerationEntity]),
    RabbitModule.forServerProxy(RabbitServiceName.MODERATION)
  ],
  controllers: [ModerationController],
  providers: [ModerationService],
})

export class ModerationModule {}
