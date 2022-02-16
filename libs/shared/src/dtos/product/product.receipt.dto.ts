import { BaseDto } from "@crm/shared/dtos/base.dto";
import { CategoryDto } from "@crm/shared/dtos/category/category.dto";
import { FileDto } from "@crm/shared/dtos/file.dto";
import { Expose, Type } from "class-transformer";

/** DTO товара в чеке */
@Expose()
export class ProductReceiptDto extends BaseDto {

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

  /** Цена за штуку */
  @Expose()
  public price: number;

  /** Количество */
  @Expose()
  public count: number;

  /** Общая цена */
  @Expose()
  public totalPrice: number;

}
