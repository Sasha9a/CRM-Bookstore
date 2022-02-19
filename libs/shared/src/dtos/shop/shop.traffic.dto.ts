import { ShopDto } from "@crm/shared/dtos/shop/shop.dto";
import { Expose, Type } from "class-transformer";

/** DTO данных о трафике по магазину */
@Expose()
export class ShopTrafficDto {

  /** Магазин */
  @Expose()
  @Type(() => ShopDto)
  public shop: ShopDto;

  /** Сколько зашло */
  @Expose()
  public in: number;

  /** Сколько прошло мимо */
  @Expose()
  public notcome: number;

  /** Конверсия, вход */
  @Expose()
  public entrance: number;

}
