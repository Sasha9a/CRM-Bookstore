import { Expose } from "class-transformer";
import { IsOptional } from "class-validator";

/** Базовый DTO для многих DTO */
@Expose()
export class BaseDto {
  /** ID сущности */
  @Expose()
  @IsOptional()
  public _id?: string;
}
