import { Expose } from "class-transformer";
import { IsInt, IsOptional, IsString } from "class-validator";

/** DTO создания магазина */
@Expose()
export class ShopFormDto {

  /** Адрес */
  @Expose()
  @IsString({ message: "Введите адрес" })
  public address: string;

  /** Широта */
  @Expose()
  @IsInt({ message: "Введите координату" })
  public lat: number;

  /** Долгота */
  @Expose()
  @IsInt({ message: "Введите координату" })
  public lng: number;

  /** Метро */
  @Expose()
  @IsOptional()
  public metro?: string;

  /** Режим работы */
  @Expose()
  @IsString({ message: "Введите режим работы" })
  public openingHours: string;
}
