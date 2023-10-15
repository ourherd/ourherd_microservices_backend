import { IsNotEmpty, IsString, IsEmail, isUUID } from 'class-validator';

export class EmailSubscriptionMemberDto {
  // Validates for a non-empty string
  @IsString()
  @IsNotEmpty()
  public id: string;

  // Gets only validated if it's part of the request's body
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  public email: string;

}
