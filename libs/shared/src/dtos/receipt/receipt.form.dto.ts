import { ProductDto } from "@crm/shared/dtos/product/product.dto";
import { ShopDto } from "@crm/shared/dtos/shop/shop.dto";
import { UserDto } from "@crm/shared/dtos/user/user.dto";
import { PaymentTypeEnum } from "@crm/shared/enums/payment.type.enum";
import { Expose, Transform, Type } from "class-transformer";
import { ArrayMinSize, IsDate, IsDefined } from "class-validator";

/** DTO создания чеков */
@Expose()
export class ReceiptFormDto {

  /** Дата совершения покупки */
  @Expose()
  @Transform(({ value }) => value ? new Date(value) : undefined)
  @IsDate({ message: "Выберите дату" })
  public date: Date;

  /** Магазин, где совершена покупка */
  @Expose()
  @IsDefined({ message: "Выберите магазин" })
  @Type(() => ShopDto)
  public shop: Partial<ShopDto>;

  /** Продавец */
  @Expose()
  @IsDefined({ message: "Выберите продавца" })
  @Type(() => UserDto)
  public salesman: Partial<UserDto>;

  /** Товары */
  @Expose()
  @ArrayMinSize(1, { message: "Список товаров пустой" })
  @Type(() => ProductDto)
  public products: ProductDto[] = [];

  /** Кол-во товара */
  @Expose()
  @IsDefined({ message: "Введите кол-во товара" })
  public count: Record<string, number> = {};

  /** Итоговая цена */
  @Expose()
  @IsDefined({ message: "Введите сумму оплаты" })
  public sum: Record<PaymentTypeEnum, number> = {
    CASH: undefined,
    CASHLESS: undefined,
    SO_SO: undefined
  };

}
