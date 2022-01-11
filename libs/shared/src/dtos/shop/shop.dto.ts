import { BaseDto } from "@crm/shared/dtos/base.dto";
import { Expose } from "class-transformer";

/** DTO магазина */
@Expose()
export class ShopDto extends BaseDto {

  /** Адрес */
  @Expose()
  public address: string;

  /** Метро */
  @Expose()
  public metro: string;

  /** Режим работы */
  @Expose()
  public openingHours: string;
}
