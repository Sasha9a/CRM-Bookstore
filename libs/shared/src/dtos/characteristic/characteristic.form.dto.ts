import { CategoryDto } from "@crm/shared/dtos/category/category.dto";
import { Expose, Type } from "class-transformer";
import { IsDefined, IsString } from "class-validator";

/** DTO создания характеристики */
@Expose()
export class CharacteristicFormDto {

  /** Название */
  @Expose()
  @IsString({ message: "Введите значение" })
  public name: string;

  /** Местоположение по очередности */
  @Expose()
  @IsDefined({ message: "Введите значение" })
  public order: number;

  /** Категория */
  @Expose()
  @IsDefined({ message: "Не выбрана категория" })
  @Type(() => CategoryDto)
  public category: CategoryDto;

}
