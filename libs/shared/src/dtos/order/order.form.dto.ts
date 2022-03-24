import { ProductOrderDto } from "@crm/shared/dtos/product/product.order.dto";
import { ShopDto } from "@crm/shared/dtos/shop/shop.dto";
import { UserDto } from "@crm/shared/dtos/user/user.dto";
import { Expose, Transform, Type } from "class-transformer";
import { ArrayMinSize, IsDate, IsDefined, IsString } from "class-validator";

/** DTO создания заказов */
@Expose()
export class OrderFormDto {

  /** Дата совершения заказа */
  @Expose()
  @Transform(({ value }) => value ? new Date(value) : undefined)
  @IsDate({ message: "Выберите дату" })
  public date: Date;

  /** Поставщик */
  @Expose()
  @IsString({ message: "Введите поставщика" })
  public supplier: string;

  /** Магазин, где совершен заказ */
  @Expose()
  @IsDefined({ message: "Выберите магазин" })
  @Type(() => ShopDto)
  public shop: Partial<ShopDto>;

  /** Кто заказ совершил */
  @Expose()
  @IsDefined({ message: "Выберите заказчика" })
  @Type(() => UserDto)
  public employee: Partial<UserDto>;

  /** Товары */
  @Expose()
  @ArrayMinSize(1, { message: "Список товаров пустой" })
  @Type(() => ProductOrderDto)
  public products: ProductOrderDto[] = [];

  /** Сумма */
  @Expose()
  @IsDefined({ message: "Введите итоговую сумму" })
  public sum: number;

}
