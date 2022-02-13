import { UserDto } from "@crm/shared/dtos/user/user.dto";
import { Expose, Type } from "class-transformer";

/** DTO информации о зарплате */
@Expose()
export class SalaryInfoDto {

  /** Сотрудник */
  @Expose()
  @Type(() => UserDto)
  public user: Partial<UserDto>;

  /** Всего рабочих дней */
  @Expose()
  public daysWorkedAll: number;

  /** Отработанные дни */
  @Expose()
  public daysWorked: number;

  /** Премия */
  @Expose()
  public premium: number;

  /** Штраф */
  @Expose()
  public fine: number;

  /** Дни пропущенные по болезни */
  @Expose()
  public sickDays: number;

  /** Дни по отпуску */
  @Expose()
  public vacationDays: number;

  /** Денег выплаченные по больничному */
  @Expose()
  public sickPay: number;

  /** Денег выплаченные по отпуску */
  @Expose()
  public vacationPay: number;

  /** Описание */
  @Expose()
  public description: string;

  /** Итоговая сумма зарплаты сотруднику */
  @Expose()
  public sumEmployee: number;

  /** Итоговая сумма зарплаты с налогами */
  @Expose()
  public sumTaxes: number;

}
