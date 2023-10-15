import { NestFactory } from '@nestjs/core';
import { SurveyModule } from './survey.module';

async function bootstrap() {
  const app = await NestFactory.create(SurveyModule);
  await app.listen(3000);
}
bootstrap();
