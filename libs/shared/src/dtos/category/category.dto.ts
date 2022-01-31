import { BaseDto } from "@crm/shared/dtos/base.dto";
import { CharacteristicDto } from "@crm/shared/dtos/category/characteristic.dto";
import { Expose, Type } from "class-transformer";

/** DTO категории */
@Expose()
export class CategoryDto extends BaseDto {

  /** Название */
  @Expose()
  public name: string;

  /** Родительская категория */
  @Expose()
  @Type(() => CategoryDto)
  public parent: CategoryDto;

  /** Подкатегории */
  @Expose()
  @Type(() => CategoryDto)
  public children: CategoryDto[];

  /** Список характеристик */
  @Expose()
  @Type(() => CharacteristicDto)
  public characteristics: CharacteristicDto[];

}
