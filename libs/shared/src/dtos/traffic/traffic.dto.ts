import { BaseDto } from "@crm/shared/dtos/base.dto";
import { ShopTrafficDto } from "@crm/shared/dtos/shop/shop.traffic.dto";
import { Expose, Type } from "class-transformer";

/** DTO данных трафика */
@Expose()
export class TrafficDto extends BaseDto {

  /** Дата */
  @Expose()
  public date: Date;

  /** Данные в каждом магазине */
  @Expose()
  @Type(() => ShopTrafficDto)
  public shops: ShopTrafficDto[];

}
