import { Expose } from "class-transformer";
import { IsOptional } from "class-validator";

@Expose()
export class BaseDto {
  @Expose()
  @IsOptional()
  public _id?: string;
}
