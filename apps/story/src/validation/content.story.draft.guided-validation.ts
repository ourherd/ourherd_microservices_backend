import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, Matches } from 'class-validator';

@ValidatorConstraint({ name: 'contentValidation', async: false })
export class ContentValidation implements ValidatorConstraintInterface {

  private CONTENT_1 = 'content_1';
  private CONTENT_2 = 'content_2';
  private CONTENT_3 = 'content_3';
  private CONTENT_4 = 'content_4';

  validate(value: string, args: ValidationArguments) {

    if ( value.length > 0 && value.length < 750 ) {
      return true;
    }
    let status = false;
    const object = args.object as any;
    Object.keys(object).forEach(key => {

      if ( key === this.CONTENT_1 ){
        return ( object[key] !== null || object[key] === undefined );
      }

      if ( key === this.CONTENT_2 ){
        return ( object[key] !== null || object[key] === undefined );
      }

      if ( key === this.CONTENT_3 ){
        return ( object[key] !== null || object[key] === undefined );
      }

      if ( key === this.CONTENT_4 ){
        return ( object[key] !== null || object[key] === undefined );
      }
    });

    return status;
  }

  defaultMessage(args: ValidationArguments) {

    return 'At least one content is necessary to create a story';
  }
}
