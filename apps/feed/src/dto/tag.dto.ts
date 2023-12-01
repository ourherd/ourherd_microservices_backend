import { IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class TagDto {

  @IsUUID()
  @IsOptional()
  readonly id: string;

  @IsString()
  @IsOptional()
  public name: string;

  @IsNumber()
  @IsOptional()
  readonly order: number;

}
