import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { MemberService } from "../../../../apps/member/src/member.service";

@ValidatorConstraint({ name: 'isEmailUserAlreadyExist', async: true })
@ValidatorConstraint({ async: true })
export class IsEmailUserAlreadyExistConstraint implements ValidatorConstraintInterface {
  // constructor(protected readonly memberService: MemberService) {}
  constructor(private readonly memberService: MemberService) {}

  async validate(email) {
    const { state, data: member } = await this.memberService.findByEmail(email);

    return member !== undefined ? true : false;
  }
}

export function IsEmailUserAlreadyExist(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailUserAlreadyExistConstraint,
    });
  };
}
