import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from "class-validator";
import { MemberEntity } from "../../../../apps/member/src/entity/member.entity";
import { Injectable } from "@nestjs/common";

import { Repository } from 'typeorm';
import { InjectRepository } from "@nestjs/typeorm";


@ValidatorConstraint({ async: true })
@Injectable()
export class IsEmailNotRegistered implements ValidatorConstraintInterface {

  constructor(
    @InjectRepository(MemberEntity)
    private memberRepository: Repository<MemberEntity>,
  ) {}

  async validate(email: string, args: ValidationArguments) {

    const memberRepository : Repository<MemberEntity> = await (
      await import('../../../../apps/member/src/entity/member.entity')
    );

    return !!!(await memberRepository.findOne({ where: { email } }));
    //
    // const member = await this.memberService.findByEmail(email);
    // return member !== undefined ? true : false;
  }
}

export function EmailNotRegistered(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailNotRegistered,
    });
  };
}
