import { Exclude } from "class-transformer";
import { BaseAbstractDto } from "./base.abstract.dto";

export class TagDto extends BaseAbstractDto {

  readonly id: string;

  readonly name: string;

  @Exclude()
  readonly order: number;

  @Exclude()
  readonly verified: string;

  @Exclude()
  readonly in_app: string;

  @Exclude()
  readonly updated_at?: string;

}
