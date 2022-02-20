import { Expose } from "class-transformer";

/** DTO параметров для отчета по трафику */
@Expose()
export class TrafficReportQueryParamsDto {

  /** Дата начала периода */
  @Expose()
  public from: Date;

  /** Дата конца периода */
  @Expose()
  public to: Date;

  /** Магазин */
  @Expose()
  public shop: string;

}
