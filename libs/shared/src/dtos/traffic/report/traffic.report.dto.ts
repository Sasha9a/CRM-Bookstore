import { TrafficReportItemDto } from "@crm/shared/dtos/traffic/report/traffic.report.item.dto";
import { TrafficReportSumsDto } from "@crm/shared/dtos/traffic/report/traffic.report.sums.dto";
import { Expose, Type } from "class-transformer";

/** DTO отчета по трафику */
@Expose()
export class TrafficReportDto {

  /** Суммированная сводка */
  @Expose()
  @Type(() => TrafficReportSumsDto)
  public sums: TrafficReportSumsDto;

  /** Сводка по каждому магазину */
  @Expose()
  @Type(() => TrafficReportItemDto)
  public items: TrafficReportItemDto[];

}
