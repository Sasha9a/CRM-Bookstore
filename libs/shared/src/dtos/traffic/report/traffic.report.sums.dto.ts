import { Expose } from "class-transformer";

/** DTO сводки по трафику */
@Expose()
export class TrafficReportSumsDto {

  /** По дням */
  @Expose()
  public days: Record<string, {
      in: number,
      notcome: number,
      receipt: number
  }>;

  /** По неделям */
  @Expose()
  public weeks: Record<string, {
    in: number,
    notcome: number,
    receipt: number
  }>;

  /** По месяцам */
  @Expose()
  public months: Record<string, {
    in: number,
    notcome: number,
    receipt: number
  }>;

  /** Сколько зашло итого */
  @Expose()
  public in: number;

  /** Сколько прошло мимо итого */
  @Expose()
  public notcome: number;

  /** Кол-во чеков итого */
  @Expose()
  public countReceipt: number;

  /** Конверсия, вход итого */
  @Expose()
  public entrance: number;

  /** Конверсия, чеков итого */
  @Expose()
  public conversionReceipt: number;

}
