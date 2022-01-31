import { CategoryDto } from "@crm/shared/dtos/category/category.dto";
import { CharacteristicFormDto } from "@crm/shared/dtos/category/characteristic.form.dto";
import { Expose, Type } from "class-transformer";
import { IsOptional, IsString, ValidateNested } from "class-validator";

/** DTO создания категории */
@Expose()
export class CategoryFormDto {

  /** Название */
  @Expose()
  @IsString({ message: "Введите значение" })
  public name: string;

  /** Родительская категория */
  @Expose()
  @IsOptional()
  @Type(() => CategoryDto)
  public parent?: CategoryDto;

  /** Список характеристик */
  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => CharacteristicFormDto)
  public characteristics?: CharacteristicFormDto[];

}
