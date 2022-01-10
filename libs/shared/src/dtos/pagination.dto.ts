import { Expose, Transform } from "class-transformer";
import { IsNumber } from "class-validator";

/** DTO для регулирования страниц сущностей */
@Expose()
export class PaginationDto {

  /** Максимальное кол-во сущностей за раз */
  @Expose()
  @IsNumber()
  @Transform((param) => parseInt(param.value, 0))
  public limit: number;

  /** Отступ от начала списка сущностей */
  @Expose()
  @IsNumber()
  @Transform((param) => parseInt(param.value, 0))
  public offset: number;

}
