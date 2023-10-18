import { Module } from '@nestjs/common';
import { StoryController } from './story.controller';
import { StoryService } from './story.service';
import { RabbitModule, RabbitServiceName } from '@app/rabbit';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Database, DatabaseModule } from '@app/database';
import { getEnvPath } from '@app/common/env/env.helper';
import { StoryEntity } from "./entity/story.entity";

const envFilePath: string = getEnvPath(`${__dirname}/`);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envFilePath
    }),
    DatabaseModule.register(Database.PRIMARY),
    DatabaseModule.forEntity(Database.PRIMARY, [StoryEntity]),
    RabbitModule.forServerProxy(RabbitServiceName.STORY)
  ],
  controllers: [StoryController],
  providers: [StoryService],
})

export class StoryModule {}
