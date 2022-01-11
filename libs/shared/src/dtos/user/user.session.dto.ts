import { BaseDto } from "@crm/shared/dtos/base.dto";
import { FileDto } from "@crm/shared/dtos/file.dto";
import { ShopDto } from "@crm/shared/dtos/shop/shop.dto";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { Expose } from "class-transformer";

/** DTO авторизованного пользователя */
@Expose()
export class UserSessionDto extends BaseDto {

  /** Логин */
  @Expose()
  public login: string;

  /** ФИО */
  @Expose()
  public name: string;

  /** Дата рождения */
  @Expose()
  public dateOfBirth: Date;

  /** Магазин, где работает */
  @Expose()
  public shop: ShopDto;

  /** Телефон */
  @Expose()
  public telephone: string;

  /** Адрес жительства */
  @Expose()
  public address: string;

  /** Должность */
  @Expose()
  public position: string;

  /** Роли пользователя */
  @Expose()
  public roles: RoleEnum[];

  /** Зарплата */
  @Expose()
  public salary: number;

  /** Фото пользователя */
  @Expose()
  public avatar: FileDto;

}
