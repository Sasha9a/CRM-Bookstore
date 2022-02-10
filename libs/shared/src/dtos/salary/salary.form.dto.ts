import { SalaryInfoFormDto } from "@crm/shared/dtos/salary/salary.info.form.dto";
import { Expose, Transform, Type } from "class-transformer";
import { ArrayMinSize, IsDate, IsDefined, IsOptional, ValidateNested } from "class-validator";

/** DTO ввода зарплат */
@Expose()
export class SalaryFormDto {

  /** Дата начисления зарплаты */
  @Expose()
  @Transform(({ value }) => value ? new Date(value) : undefined)
  @IsDate({ message: "Выберите дату начисления зарплаты" })
  public date: Date;

  /** Период начала работ */
  @Expose()
  @Transform(({ value }) => value ? new Date(value) : undefined)
  @IsDate({ message: "Выберите дату начала работ" })
  public dateFrom: Date;

  /** Период окончания работ */
  @Expose()
  @Transform(({ value }) => value ? new Date(value) : undefined)
  @IsDate({ message: "Выберите дату окончания работ" })
  public dateTo: Date;

  /** Описание */
  @Expose()
  @IsOptional()
  public description?: string;

  /** Информация о зарплате списка сотрудников */
  @Expose()
  @ArrayMinSize(1, { message: "Список сотрудников пустой" })
  @ValidateNested()
  @Type(() => SalaryInfoFormDto)
  public info?: SalaryInfoFormDto[] = [];

  /** Итого сумма зарплаты */
  @Expose()
  @IsDefined({ message: "Введите итоговую сумму зарплаты" })
  public sum: number;

}
