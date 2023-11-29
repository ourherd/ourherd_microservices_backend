import {
  ValidatorConstraint,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
  ValidatorConstraintInterface,
} from "class-validator";

const MIN_AGE = 13;

@ValidatorConstraint()
export class DateOfBirthValidation implements ValidatorConstraintInterface {

  validate(value: string, args: ValidationArguments): boolean {

    const [day, month, year] = value.split('/');
    let birthday = new Date( +year, +month-1, day );
    let min_age = new Date();
    min_age.setFullYear( min_age.getFullYear() - MIN_AGE );
    min_age.setHours(0,0,0,0);

    if ( min_age >= birthday ) {
      return true;
    }
    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return 'You need to 13 years old or older to create an account.';
  }

}

export function isValidBirthday(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isValidBirthday',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: DateOfBirthValidation
    });
  };
}
