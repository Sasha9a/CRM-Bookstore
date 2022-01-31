import { Expose } from "class-transformer";
import { IsDefined, IsString } from "class-validator";

/** DTO создания характеристики */
@Expose()
export class CharacteristicFormDto {

  /** Название */
  @Expose()
  @IsString({ message: "Введите название характеристики" })
  public name: string;

  /** Местоположение по очередности */
  @Expose()
  @IsDefined({ message: "Введите очередность характеристики" })
  public order: number;

}
