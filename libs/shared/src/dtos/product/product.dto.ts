import { BaseDto } from "@crm/shared/dtos/base.dto";
import { CategoryDto } from "@crm/shared/dtos/category/category.dto";
import { FileDto } from "@crm/shared/dtos/file.dto";
import { Expose, Type } from "class-transformer";

/** DTO товара */
@Expose()
export class ProductDto extends BaseDto {

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

  /** Кол-во товара в точках */
  @Expose()
  public count: Record<string, number>;

  /** Категория */
  @Expose()
  @Type(() => CategoryDto)
  public category: CategoryDto;

  /** Цена */
  @Expose()
  public price: number;

  /** Характеристики */
  @Expose()
  public characteristics: Record<string, string>;

}
