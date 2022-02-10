import { UserDto } from "@crm/shared/dtos/user/user.dto";
import { Expose, Type } from "class-transformer";

/** DTO информации о зарплате */
@Expose()
export class SalaryInfoDto {

  /** Сотрудник */
  @Expose()
  @Type(() => UserDto)
  public user: Partial<UserDto>;

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
