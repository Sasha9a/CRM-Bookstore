import { BaseDto } from "@crm/shared/dtos/base.dto";
import { CategoryDto } from "@crm/shared/dtos/category/category.dto";
import { Expose, Type } from "class-transformer";

/** DTO характеристики */
@Expose()
export class CharacteristicDto extends BaseDto {

  /** Название */
  @Expose()
  public name: string;

  /** Местоположение по очередности */
  @Expose()
  public order: number;

  /** Категория */
  @Expose()
  @Type(() => CategoryDto)
  public category: CategoryDto;
  
}
