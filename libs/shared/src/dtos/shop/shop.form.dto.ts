import { Expose } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

/** DTO создания магазина */
@Expose()
export class ShopFormDto {

  /** Адрес */
  @Expose()
  @IsString({ message: "Введите адрес" })
  public address: string;

  /** Метро */
  @Expose()
  @IsOptional()
  public metro?: string;

  /** Режим работы */
  @Expose()
  @IsString({ message: "Введите режим работы" })
  public openingHours: string;
}
