import { Expose } from "class-transformer";

/** DTO данных о трафике по магазину */
@Expose()
export class ShopTrafficDto {

  /** Сколько зашло */
  @Expose()
  public in: number;

  /** Сколько прошло мимо */
  @Expose()
  public notcome: number;

  /** Конверсия, вход */
  @Expose()
  public entrance: number;

}
