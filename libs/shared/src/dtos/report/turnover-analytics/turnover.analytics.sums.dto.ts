import { CategoryDto } from "@crm/shared/dtos/category/category.dto";
import { ProductDto } from "@crm/shared/dtos/product/product.dto";
import { Expose } from "class-transformer";

/** DTO сводки по товарооборота */
@Expose()
export class TurnoverAnalyticsSumsDto {

  /** Средний чек */
  @Expose()
  public averageCheck: number;

  /** Среднее кол-во чеков */
  @Expose()
  public averageNumberOfChecks: number;

  /** Кол-во чеков всего */
  @Expose()
  public allChecks: number;

  /** Популярный товар */
  @Expose()
  public popularProduct: Partial<ProductDto>;

  /** Популярная категория */
  @Expose()
  public popularCategory: Partial<CategoryDto>;

}
