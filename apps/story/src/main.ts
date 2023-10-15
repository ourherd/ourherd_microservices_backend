import { NestFactory } from '@nestjs/core';
import { StoryModule } from './story.module';

async function bootstrap() {
  const app = await NestFactory.create(StoryModule);
  await app.listen(3000);
}
bootstrap();
