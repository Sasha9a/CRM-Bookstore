import { ShopTrafficDto } from "@crm/shared/dtos/shop/shop.traffic.dto";
import { Expose, Transform, Type } from "class-transformer";
import { ArrayMinSize, IsDate, IsDefined } from "class-validator";

/** DTO создания трафика */
@Expose()
export class TrafficFormDto {

  /** Дата */
  @Expose()
  @Transform(({ value }) => value ? new Date(value) : undefined)
  @IsDate({ message: "Выберите дату" })
  public date: Date;

  /** Данные в каждом магазине */
  @Expose()
  @ArrayMinSize(1, { message: "Список магазинов пустой" })
  @Type(() => ShopTrafficDto)
  public shops: ShopTrafficDto[] = [];

  /** Сколько зашло итого */
  @Expose()
  @IsDefined({ message: "Введите сколько зашло итого" })
  public in = 0;

  /** Сколько прошло мимо итого */
  @Expose()
  @IsDefined({ message: "Введите сколько прошло мимо итого" })
  public notcome = 0;

  /** Конверсия, вход итого */
  @Expose()
  @IsDefined({ message: "Введите конверсию, вход итого" })
  public entrance = 0;

}
