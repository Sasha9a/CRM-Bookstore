import { BaseDto } from "@crm/shared/dtos/base.dto";
import { SalaryInfoDto } from "@crm/shared/dtos/salary/salary.info.dto";
import { Expose, Type } from "class-transformer";

/** DTO зарплат */
@Expose()
export class SalaryDto extends BaseDto {

  /** Дата начисления зарплаты */
  @Expose()
  public date: Date;

  /** Период начала работ */
  @Expose()
  public dateFrom: Date;

  /** Период окончания работ */
  @Expose()
  public dateTo: Date;

  /** Описание */
  @Expose()
  public description: string;

  /** Информация о зарплате списка сотрудников */
  @Expose()
  @Type(() => SalaryInfoDto)
  public info: SalaryInfoDto[];

  /** Итого сумма зарплаты */
  @Expose()
  public sum: number;

}
