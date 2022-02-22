import { TurnoverAnalyticsItemDto } from "@crm/shared/dtos/report/turnover-analytics/turnover.analytics.item.dto";
import { TurnoverAnalyticsSumsDto } from "@crm/shared/dtos/report/turnover-analytics/turnover.analytics.sums.dto";
import { Expose, Type } from "class-transformer";

/** DTO отчета аналитики товарооборота */
@Expose()
export class TurnoverAnalyticsDto {

  /** Сводка по каждому магазину */
  @Expose()
  @Type(() => TurnoverAnalyticsItemDto)
  public items: TurnoverAnalyticsItemDto[];

  /** Суммированная сводка */
  @Expose()
  @Type(() => TurnoverAnalyticsSumsDto)
  public sums: TurnoverAnalyticsSumsDto;

}
