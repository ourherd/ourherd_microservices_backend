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

  async validate(email: string, ) {
    return true;
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
