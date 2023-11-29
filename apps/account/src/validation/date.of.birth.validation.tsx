import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

const MIN_AGE = 13;

@Injectable()
export class DateOfBirthValidation implements ValidatorConstraintInterface {

  validate(value: string): Promise<boolean> {

     const [day, month, year] = value.split('/');
     const birthday = new Date( year, month, day );

     console.log(birthday);

     const min = new Date();
     min.setFullYear( min.getFullYear() - MIN_AGE );

    console.log(min);

    if ( min < birthday ) {
       return true;
     }

     return false;
  }
}
