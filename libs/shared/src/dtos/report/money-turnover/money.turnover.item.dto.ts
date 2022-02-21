import { Expose } from "class-transformer";

/** DTO данных о денежных оборота по статьям */
@Expose()
export class MoneyTurnoverItemDto {

  /** Название статьи */
  @Expose()
  public name: string;

  /** Кол-во денег по датам */
  @Expose()
  public moneyTurnover: {
    days: Record<string, number>,
    weeks: Record<string, number>,
    months: Record<string, number>
  };

}
