import { Expose } from "class-transformer";

/** DTO сводки по денежнему обороту */
@Expose()
export class MoneyTurnoverSumsDto {

  /** По дням */
  @Expose()
  public days: Record<string, {
    income: number,
    expenses: number
  }>;

  /** По неделям */
  @Expose()
  public weeks: Record<string, {
    income: number,
    expenses: number
  }>;

  /** По месяцам */
  @Expose()
  public months: Record<string, {
    income: number,
    expenses: number
  }>;

  /** Доходы итого */
  @Expose()
  public income: number;

  /** Расходы итого */
  @Expose()
  public expenses: number;

}
