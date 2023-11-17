import { Test, TestingModule } from '@nestjs/testing';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

describe('TagController', () => {
  let tagController: TagController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TagController],
      providers: [TagService],
    }).compile();

    tagController = app.get<TagController>(TagController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(tagController.getHello()).toBe('Hello World!');
    });
  });
});
