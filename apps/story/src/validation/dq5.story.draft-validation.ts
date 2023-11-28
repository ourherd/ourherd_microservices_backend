import { ValidationArguments, ValidatorConstraintInterface } from "class-validator";

export class dq5StoryDraftValidation implements ValidatorConstraintInterface {

  validate(value: string, args: ValidationArguments) {

    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return 'At least one content is necessary to create a story';
  }

}
