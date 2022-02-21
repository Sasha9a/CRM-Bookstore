import { Expose } from "class-transformer";
import { IsOptional } from "class-validator";

/** DTO параметров для отчета по обороту денег */
@Expose()
export class MoneyTurnoverQueryParamsDto {

  /** Дата начала периода */
  @Expose()
  public from: Date;

  /** Дата конца периода */
  @Expose()
  public to: Date;

  /** Магазин */
  @Expose()
  @IsOptional()
  public shop?: string;

}
