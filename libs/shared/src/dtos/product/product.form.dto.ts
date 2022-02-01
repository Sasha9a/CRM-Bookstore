import { CategoryDto } from "@crm/shared/dtos/category/category.dto";
import { FileDto } from "@crm/shared/dtos/file.dto";
import { Expose, Type } from "class-transformer";
import { IsDefined, IsOptional, IsString } from "class-validator";

/** DTO создания товара */
@Expose()
export class ProductFormDto {

  /** Название */
  @Expose()
  @IsString({ message: "Введите название" })
  public name: string;

  /** Артикул */
  @Expose()
  @IsString({ message: "Введите артикул" })
  public code: string;

  /** Фото товара */
  @Expose()
  @IsOptional()
  @Type(() => FileDto)
  public image?: FileDto;

  /** Кол-во товара в точках */
  @Expose()
  @IsOptional()
  public count?: Record<string, number> = {};

  /** Категория */
  @Expose()
  @IsOptional()
  @Type(() => CategoryDto)
  public category?: CategoryDto;

  /** Цена */
  @Expose()
  @IsDefined({ message: "Введите цену" })
  public price: number;

  /** Характеристики */
  @Expose()
  @IsOptional()
  public characteristics?: Record<string, string> = {};

}
