import { BaseDto } from "@crm/shared/dtos/base.dto";
import { ProductOrderDto } from "@crm/shared/dtos/product/product.order.dto";
import { ShopDto } from "@crm/shared/dtos/shop/shop.dto";
import { UserDto } from "@crm/shared/dtos/user/user.dto";
import { Expose, Type } from "class-transformer";

/** DTO заказов */
@Expose()
export class OrderDto extends BaseDto {

  /** Дата совершения заказа */
  @Expose()
  public date: Date;

  /** Магазин, где совершен заказ */
  @Expose()
  @Type(() => ShopDto)
  public shop: ShopDto;

  /** Кто заказ совершил */
  @Expose()
  @Type(() => UserDto)
  public employee: UserDto;

  /** Товары */
  @Expose()
  @Type(() => ProductOrderDto)
  public products: ProductOrderDto[];

  /** Сумма */
  @Expose()
  public sum: number;

}
