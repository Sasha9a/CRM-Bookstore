import { Expose } from "class-transformer";
import { IsDefined, IsString } from "class-validator";

/** DTO создания характеристики */
@Expose()
export class CharacteristicFormDto {

  /** Название */
  @Expose()
  @IsString({ message: "Введите значение" })
  public name: string;

  /** Местоположение по очередности */
  @Expose()
  @IsDefined({ message: "Введите значение" })
  public order: number;

}
