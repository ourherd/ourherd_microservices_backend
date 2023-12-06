import { Exclude } from "class-transformer";

export class TagDto {

  readonly id: string;

  readonly name: string;

  readonly order: number;

  @Exclude()
  readonly created_at: string;

  @Exclude()
  readonly updated_at: string;

  @Exclude()
  readonly deleted_at: string;

  @Exclude()
  readonly verified: string;

  @Exclude()
  readonly in_app: string;

}
