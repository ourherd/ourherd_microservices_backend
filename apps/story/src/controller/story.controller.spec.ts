import { Test, TestingModule } from '@nestjs/testing';
import { StoryController } from './story.controller';
import { StoryService } from '../service/story.service';

describe('StoryController', () => {
  let storyController: StoryController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [StoryController],
      providers: [StoryService],
    }).compile();

    storyController = app.get<StoryController>(StoryController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(storyController.getHello()).toBe('Hello World!');
    });
  });
});
