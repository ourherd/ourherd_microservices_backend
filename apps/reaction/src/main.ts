import { NestFactory } from '@nestjs/core';
import { ReactionModule } from './reaction.module';

async function bootstrap() {
  const app = await NestFactory.create(ReactionModule);
  await app.listen(3000);
}
bootstrap();
