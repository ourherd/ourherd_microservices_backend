import { Injectable, Logger } from "@nestjs/common";
import { TAG_SERVICE } from "./constant/tag-patterns.constants";

@Injectable()
export class TagService {

  private logger = new Logger(TAG_SERVICE);

}
