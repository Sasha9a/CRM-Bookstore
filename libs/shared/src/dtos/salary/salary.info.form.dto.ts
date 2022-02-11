import { UserDto } from "@crm/shared/dtos/user/user.dto";
import { Expose, Type } from "class-transformer";
import { IsDefined, IsOptional } from "class-validator";

/** DTO ввода информации о зарплате */
@Expose()
export class SalaryInfoFormDto {

  /** Сотрудник */
  @Expose()
  @IsDefined({ message: "Не выбран сотрудник" })
  @Type(() => UserDto)
  public user: Partial<UserDto>;

  /** Всего рабочих дней */
  @Expose()
  @IsDefined({ message: "Введите всего рабочих дней" })
  public daysWorkedAll = 0;

  /** Отработанные дни */
  @Expose()
  @IsDefined({ message: "Введите отработанные дни" })
  public daysWorked = 0;

  /** Премия */
  @Expose()
  @IsOptional()
  public premium?: number;

  /** Штраф */
  @Expose()
  @IsOptional()
  public fine?: number;

  /** Дни пропущенные по болезни */
  @Expose()
  @IsOptional()
  public sickDays?: number;

  /** Дни по отпуску */
  @Expose()
  @IsOptional()
  public vacationDays?: number;

  /** Описание */
  @Expose()
  @IsOptional()
  public description?: string;

  /** Итоговая сумма зарплаты сотруднику */
  @Expose()
  @IsDefined({ message: "Введите итоговую сумму зарплаты" })
  public sumEmployee: number;

  /** Итоговая сумма зарплаты с налогами */
  @Expose()
  @IsDefined({ message: "Введите итоговую сумму зарплаты с налогами" })
  public sumTaxes: number;

}
