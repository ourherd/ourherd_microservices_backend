import { Controller, Get } from '@nestjs/common';
import { ReactionService } from './reaction.service';

@Controller()
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}

  @Get()
  getHello(): string {
    return this.reactionService.getHello();
  }
}
