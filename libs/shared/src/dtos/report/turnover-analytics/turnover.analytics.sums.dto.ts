import { CategoryDto } from "@crm/shared/dtos/category/category.dto";
import { ProductDto } from "@crm/shared/dtos/product/product.dto";
import { Expose } from "class-transformer";

/** DTO сводки по товарооборота */
@Expose()
export class TurnoverAnalyticsSumsDto {

  /** Средний чек */
  @Expose()
  public averageCheck: {
    days: Record<string, number>,
    weeks: Record<string, number>,
    months: Record<string, number>
  }

  /** Среднее кол-во чеков */
  @Expose()
  public averageNumberOfChecks: {
    days: Record<string, number>,
    weeks: Record<string, number>,
    months: Record<string, number>
  };

  /** Популярный товар */
  @Expose()
  public popularProduct: {
    days: Record<string, Partial<ProductDto>>,
    weeks: Record<string, Partial<ProductDto>>,
    months: Record<string, Partial<ProductDto>>
  };

  /** Популярная категория */
  @Expose()
  public popularCategory: {
    days: Record<string, Partial<CategoryDto>>,
    weeks: Record<string, Partial<CategoryDto>>,
    months: Record<string, Partial<CategoryDto>>
  };

}
