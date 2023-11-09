import { Module } from '@nestjs/common';
import { SurveyController } from './survey.controller';
import { SurveyService } from './survey.service';
import { Database, DatabaseModule } from '@app/database';
import { SurveyMemberInstanceEntity } from './entities/survey-member-instances.entity';
import { RabbitModule, RabbitServiceName } from '@app/rabbit';
import { ConfigModule } from '@nestjs/config';
import { getEnvPath } from '@app/common/env/env.helper';
import { SurveyFinalResponseEntity } from './entities/survey-final-responses.entity';
import { SurveyEntity } from './entities/survey.entity';

const envFilePath: string = getEnvPath(`${__dirname}/`);
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envFilePath
    }),
    DatabaseModule.register(Database.PRIMARY),
    DatabaseModule.forEntity(Database.PRIMARY, [
      SurveyEntity,
      SurveyMemberInstanceEntity,
      SurveyFinalResponseEntity
    ]),
    RabbitModule.forServerProxy(RabbitServiceName.SURVEY),
  ],
  controllers: [SurveyController],
  providers: [SurveyService],
})
export class SurveyModule {}
