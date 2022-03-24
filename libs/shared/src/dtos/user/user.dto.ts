import { BaseDto } from "@crm/shared/dtos/base.dto";
import { FileDto } from "@crm/shared/dtos/file.dto";
import { ShopDto } from "@crm/shared/dtos/shop/shop.dto";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { ScheduleEnum } from "@crm/shared/enums/schedule.enum";
import { Expose, Type } from "class-transformer";

/** DTO пользователя */
@Expose()
export class UserDto extends BaseDto {

  /** Логин */
  @Expose()
  public login: string;

  /** Пароль */
  @Expose()
  public password: string;

  /** ФИО */
  @Expose()
  public name: string;

  /** Дата рождения */
  @Expose()
  public dateOfBirth: Date;

  /** Дата начала работы */
  @Expose()
  public startDate: Date;

  /** Магазин, где работает */
  @Expose()
  @Type(() => ShopDto)
  public shop: ShopDto;

  /** Телефон */
  @Expose()
  public telephone: string;

  /** Адрес проживания */
  @Expose()
  public address: string;

  /** Должность */
  @Expose()
  public position: string;

  /** Роли пользователя */
  @Expose()
  public roles: RoleEnum[];

  /** График работы */
  @Expose()
  public schedule: ScheduleEnum;

  /** Зарплата */
  @Expose()
  public salary: number;

  /** Фото пользователя */
  @Expose()
  @Type(() => FileDto)
  public avatar: FileDto;

  /** Токен, нужен для авторизации */
  @Expose()
  public token: string;
}
