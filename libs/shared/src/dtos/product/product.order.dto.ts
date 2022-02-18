import { BaseDto } from "@crm/shared/dtos/base.dto";
import { CategoryDto } from "@crm/shared/dtos/category/category.dto";
import { FileDto } from "@crm/shared/dtos/file.dto";
import { Expose, Type } from "class-transformer";

/** DTO товара в заказе */
@Expose()
export class ProductOrderDto extends BaseDto {

  /** Название */
  @Expose()
  public name: string;

  /** Артикул */
  @Expose()
  public code: string;

  /** Фото товара */
  @Expose()
  @Type(() => FileDto)
  public image: FileDto;

  /** Категория */
  @Expose()
  @Type(() => CategoryDto)
  public category: Partial<CategoryDto>;

  /** Цена за штуку на сайте */
  @Expose()
  public price: number;

  /** Цена за штуку от произвдителя */
  @Expose()
  public priceManufacture: number;

  /** Количество */
  @Expose()
  public count: number;

  /** Общая цена */
  @Expose()
  public totalPrice: number;

  /** Наценка */
  @Expose()
  public markup: number;

  /** Наценка в процентах */
  @Expose()
  public markupPercent: number;

}
