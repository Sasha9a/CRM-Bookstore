import { MoneyTurnoverItemDto } from "@crm/shared/dtos/report/money-turnover/money.turnover.item.dto";
import { MoneyTurnoverSumsDto } from "@crm/shared/dtos/report/money-turnover/money.turnover.sums.dto";
import { Expose, Type } from "class-transformer";

/** DTO отчета денежных оборотов */
@Expose()
export class MoneyTurnoverDto {

  /** Доходы */
  @Expose()
  @Type(() => MoneyTurnoverItemDto)
  public income: MoneyTurnoverItemDto[];

  /** Расходы */
  @Expose()
  @Type(() => MoneyTurnoverItemDto)
  public expenses: MoneyTurnoverItemDto[];

  /** Сводка по каждой статье */
  @Expose()
  @Type(() => MoneyTurnoverSumsDto)
  public sums: MoneyTurnoverSumsDto;

}
