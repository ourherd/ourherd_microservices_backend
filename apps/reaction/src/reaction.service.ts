import { Injectable } from '@nestjs/common';

@Injectable()
export class ReactionService {
  getHello(): string {
    return 'Hello World!';
  }
}
