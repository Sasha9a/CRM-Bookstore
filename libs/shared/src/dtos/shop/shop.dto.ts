import { BaseDto } from "@crm/shared/dtos/base.dto";
import { Expose } from "class-transformer";

/** DTO магазина */
@Expose()
export class ShopDto extends BaseDto {

  /** Адрес */
  @Expose()
  public address: string;

  /** Широта */
  @Expose()
  public lat: number;

  /** Долгота */
  @Expose()
  public lng: number;

  /** Метро */
  @Expose()
  public metro: string;

  /** Режим работы */
  @Expose()
  public openingHours: string;
}
