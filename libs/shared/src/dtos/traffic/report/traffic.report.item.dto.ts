import { ShopTrafficDto } from "@crm/shared/dtos/shop/shop.traffic.dto";
import { Expose, Type } from "class-transformer";

/** DTO данных трафика по магазину */
@Expose()
export class TrafficReportItemDto {

  /** Дата */
  @Expose()
  public date: Date;

  /** Данные по магазину */
  @Expose()
  @Type(() => ShopTrafficDto)
  public shop: ShopTrafficDto;

  /** Кол-во чеков */
  @Expose()
  public countReceipt: number;

  /** Конверсия, чеков */
  @Expose()
  public conversionReceipt: number;

}
