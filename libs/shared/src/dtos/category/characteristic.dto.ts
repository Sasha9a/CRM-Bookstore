import { BaseDto } from "@crm/shared/dtos/base.dto";
import { Expose } from "class-transformer";

/** DTO характеристики */
@Expose()
export class CharacteristicDto extends BaseDto {

  /** Название */
  @Expose()
  public name: string;

  /** Местоположение по очередности */
  @Expose()
  public order: number;

}
