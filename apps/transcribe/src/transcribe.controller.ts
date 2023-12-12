import { Controller, Get } from '@nestjs/common';
import { TranscribeService } from './transcribe.service';

@Controller()
export class TranscribeController {

  constructor(private readonly transcribeService: TranscribeService) {}

  @Get()
  getHello(): string {
    return this.transcribeService.getHello();
  }
}
