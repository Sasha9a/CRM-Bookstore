import { Expose, Transform } from "class-transformer";
import { IsDate, IsDefined, IsString } from "class-validator";

/** DTO создания поставщика */
@Expose()
export class SupplierFormDto {

  /** Название */
  @Expose()
  @IsString({ message: "Введите название" })
  public name: string;

  /** Дата начала действия договора */
  @Expose()
  @Transform(({ value }) => value ? new Date(value) : undefined)
  @IsDate({ message: "Выберите дату начала договора" })
  public dateFrom: Date;

  /** Дата окончания действия договора */
  @Expose()
  @Transform(({ value }) => value ? new Date(value) : undefined)
  @IsDate({ message: "Выберите дату окончания договора" })
  public dateTo: Date;

  /** Сумма договора */
  @Expose()
  @IsDefined({ message: "Введите сумму" })
  public sum: number;

}
