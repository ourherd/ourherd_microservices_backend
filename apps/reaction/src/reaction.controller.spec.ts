import { Test, TestingModule } from '@nestjs/testing';
import { ReactionController } from './reaction.controller';
import { ReactionService } from './reaction.service';

describe('ReactionController', () => {
  let reactionController: ReactionController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ReactionController],
      providers: [ReactionService],
    }).compile();

    reactionController = app.get<ReactionController>(ReactionController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(reactionController.getHello()).toBe('Hello World!');
    });
  });
});
