import { BaseDto } from "@crm/shared/dtos/base.dto";
import { ProductReceiptDto } from "@crm/shared/dtos/product/product.receipt.dto";
import { ShopDto } from "@crm/shared/dtos/shop/shop.dto";
import { UserDto } from "@crm/shared/dtos/user/user.dto";
import { PaymentTypeEnum } from "@crm/shared/enums/payment.type.enum";
import { Expose, Type } from "class-transformer";

/** DTO чеков */
@Expose()
export class ReceiptDto extends BaseDto {

  /** Дата совершения покупки */
  @Expose()
  public date: Date;

  /** Магазин, где совершена покупка */
  @Expose()
  @Type(() => ShopDto)
  public shop: ShopDto;

  /** Продавец */
  @Expose()
  @Type(() => UserDto)
  public salesman: UserDto;

  /** Товары */
  @Expose()
  @Type(() => ProductReceiptDto)
  public products: ProductReceiptDto[];

  /** Итоговая цена */
  @Expose()
  public sum: Record<PaymentTypeEnum, number>;

}
