import { ShopDto } from "@crm/shared/dtos/shop/shop.dto";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { ScheduleEnum } from "@crm/shared/enums/schedule.enum";
import { Expose, Transform, Type } from "class-transformer";
import { IsDate, IsDefined, IsOptional, IsString } from "class-validator";

/** DTO создания пользователя */
@Expose()
export class UserCreateFormDto {

  /** Логин */
  @Expose()
  @IsString({ message: "Введите логин" })
  public login: string;

  /** Пароль */
  @Expose()
  @IsString({ message: "Введите пароль" })
  public password: string;

  /** ФИО */
  @Expose()
  @IsString({ message: "Введите ФИО" })
  public name: string;

  /** Дата рождения */
  @Expose()
  @Transform(({ value }) => value ? new Date(value) : undefined)
  @IsDate({ message: "Выберите дату рождения" })
  public dateOfBirth: Date;

  /** Дата начала работы */
  @Expose()
  @Transform(({ value }) => value ? new Date(value) : undefined)
  @IsDate({ message: "Выберите дату начала работы" })
  public startDate: Date;

  /** Магазин, где работает */
  @Expose()
  @IsOptional()
  @Type(() => ShopDto)
  public shop?: ShopDto;

  /** Телефон */
  @Expose()
  @IsOptional()
  public telephone?: string;

  /** Адрес жительства */
  @Expose()
  @IsOptional()
  public address?: string;

  /** Должность */
  @Expose()
  @IsOptional()
  public position?: string;

  /** Роли пользователя */
  @Expose()
  @IsDefined({ message: "Выберите роли" })
  public roles: RoleEnum[];

  /** График работы */
  @Expose()
  @IsDefined({ message: "Выберите график работы" })
  public schedule: ScheduleEnum;

  /** Зарплата */
  @Expose()
  @IsOptional()
  public salary?: number;

}
