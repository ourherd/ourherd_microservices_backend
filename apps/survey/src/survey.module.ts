import { Module } from '@nestjs/common';
import { SurveyController } from './survey.controller';
import { SurveyService } from './service/survey.service';
import { SurveyFinalService } from './service/survey.final.service';
import { Database, DatabaseModule } from '@app/database';
import { SurveyMemberInstanceEntity } from './entity/survey-member-instances.entity';
import { RabbitModule, RabbitServiceName } from '@app/rabbit';
import { ConfigModule } from '@nestjs/config';
import { getEnvPath } from '@app/common/env/env.helper';
import { SurveyFinalResponseEntity } from './entity/survey-final-responses.entity';
import { SurveyEntity } from './entity/survey.entity';

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
  providers: [SurveyService, SurveyFinalService],
})
export class SurveyModule {}
