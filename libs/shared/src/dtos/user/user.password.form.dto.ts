import { Expose } from "class-transformer";
import { IsString } from "class-validator";

/** DTO формы смены пароля пользователя */
@Expose()
export class UserPasswordFormDto {

  /** Пароль */
  @Expose()
  @IsString({ message: "Введите пароль" })
  public password: string;

  /** Повтор пароля */
  @Expose()
  @IsString({ message: "Введите пароль" })
  public repeatPassword: string;

}
