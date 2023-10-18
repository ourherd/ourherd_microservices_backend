import { IsBoolean, IsNumber, IsString } from "class-validator";

export class GetFeedDto {

  @IsString()
  readonly title: string;

  @IsString()
  readonly story_type: string;

  @IsBoolean()
  readonly has_hero_statement: boolean;

  @IsString()
  readonly hero_statement: string;

  @IsString()
  readonly content: string;

  @IsString()
  readonly content_1: string;

  @IsString()
  readonly content_2: string;

  @IsString()
  readonly content_3: string;

  @IsString()
  readonly content_4: string;

  @IsNumber()
  readonly order: number;

  @IsNumber()
  readonly ranking: number;

  @IsString()
  readonly source: string;

  @IsNumber()
  readonly revision: number;



}
