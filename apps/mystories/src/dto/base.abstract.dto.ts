import { Exclude } from "class-transformer";

export abstract class BaseAbstractDto {

  @Exclude()
  readonly created_at: string;

  @Exclude()
  readonly deleted_at: string;

}
