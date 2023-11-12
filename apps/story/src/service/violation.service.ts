import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ReactionEntity } from "../entity/reaction.entity";
import { Database } from "@app/database";
import { Repository } from "typeorm";
import { PostReactionDto } from "../dto/post.reaction.dto";
import { IServiceResponse } from "@app/rabbit";
import { REACTION_MESSAGE_DB_RESPONSE } from "../constant/reaction-patterns.constants";
import { ViolationEntity } from "../entity/violation.entity";
import { PostViolationDto } from "../dto/post.violation.dto";
import { VIOLATION_MESSAGE_DB_RESPONSE } from "../constant/violation-patterns.constants";

@Injectable()
export class ViolationService {

  private readonly logger = new Logger(ViolationService.name)
  constructor(
    @InjectRepository(ViolationEntity, Database.PRIMARY)  private violationRepository: Repository<ViolationEntity >) {}

  async reportViolationStory(violationDto: PostViolationDto): Promise<IServiceResponse<ViolationEntity>> {
    this.logger.log('Violation Post --> ' + JSON.stringify(violationDto));
    return await this.report( violationDto );
  }

  private async report( violationDto: PostViolationDto ): Promise<IServiceResponse<ViolationEntity>> {
    // TODO check if im not reporting my own Story
    const violation = await this.violationRepository.findOneBy(
      {
        member_id: violationDto.member_id,
        story_id: violationDto.story_id
      }
    );

    if ( violation === null ) {
      this.logger.log('REPORT CREATED violation --> ' + JSON.stringify(violationDto));
      const v = await this.violationRepository.create(violationDto);
      const result = await this.violationRepository.save(v);

      return {
        state: !!result,
        data: result,
        message: !!result ? VIOLATION_MESSAGE_DB_RESPONSE.CREATED : VIOLATION_MESSAGE_DB_RESPONSE.CREATED_FAILED
      }

    } else {
      const update = await this.violationRepository.update( { id: violation.id }, violationDto );
      violation.reason = violationDto.reason;
      this.logger.log('REPORT Update violation --> ' + JSON.stringify(violation));
      return {
        state: !!update,
        data: violation,
        message: VIOLATION_MESSAGE_DB_RESPONSE.CHANGED
      }


    }
  }

}
