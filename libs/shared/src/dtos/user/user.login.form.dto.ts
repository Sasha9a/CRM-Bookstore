import { Expose } from "class-transformer";
import { IsString } from "class-validator";

/** DTO формы авторизации пользователя */
@Expose()
export class UserLoginFormDto {

  /** Логин */
  @Expose()
  @IsString({ message: "Введите логин" })
  public login: string;

  /** Пароль */
  @Expose()
  @IsString({ message: "Введите пароль" })
  public password: string;
}
