import { Module } from '@nestjs/common';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { Database, DatabaseModule } from '@app/database';
import { TagEntity } from './entity/tag.entity';

import { RabbitModule, RabbitServiceName } from '@app/rabbit';
import { ConfigModule } from '@nestjs/config';
import { getEnvPath } from '@app/common/env/env.helper';


const envFilePath: string = getEnvPath(`${__dirname}/`);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envFilePath
    }),
    DatabaseModule.register(Database.PRIMARY),
    DatabaseModule.forEntity(Database.PRIMARY, [
      TagEntity
    ]),
    RabbitModule.forServerProxy(RabbitServiceName.TAG),
  ],
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}