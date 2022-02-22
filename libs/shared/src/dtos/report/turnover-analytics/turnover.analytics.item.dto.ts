import { CategoryDto } from "@crm/shared/dtos/category/category.dto";
import { ProductDto } from "@crm/shared/dtos/product/product.dto";
import { ShopDto } from "@crm/shared/dtos/shop/shop.dto";
import { Expose, Type } from "class-transformer";

/** DTO данных товарооборота по магазину */
@Expose()
export class TurnoverAnalyticsItemDto {

  /** Дата */
  @Expose()
  public date: Date;

  /** Данные по магазину */
  @Expose()
  @Type(() => ShopDto)
  public shop: Partial<ShopDto>;

  /** Сумма чеков */
  @Expose()
  public sumReceipt: number;

  /** Средний чек */
  @Expose()
  public averageCheck: number;

  /** Кол-во чеков */
  @Expose()
  public countReceipt: number;

  /** Популярный товар */
  @Expose()
  @Type(() => ProductDto)
  public popularProduct: Partial<ProductDto>;

  /** Популярная категория */
  @Expose()
  @Type(() => CategoryDto)
  public popularCategory: Partial<CategoryDto>;

}
