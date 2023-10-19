import { Controller, Logger } from "@nestjs/common";
import { FeedService } from "../service/feed.service";

@Controller()
export class FeedController {
  constructor(private readonly feedService: FeedService) {}
  logger = new Logger(FeedController.name);

}
