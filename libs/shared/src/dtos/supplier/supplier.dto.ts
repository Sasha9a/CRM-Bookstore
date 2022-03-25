import { BaseDto } from "@crm/shared/dtos/base.dto";
import { Expose } from "class-transformer";

/** DTO поставщика */
@Expose()
export class SupplierDto extends BaseDto {

  /** Название */
  @Expose()
  public name: string;

  /** Дата начала действия договора */
  @Expose()
  public startDate: Date;

  /** Дата окончания действия договора */
  @Expose()
  public endDate: Date;

  /** Сумма договора */
  @Expose()
  public sum: number;

}
