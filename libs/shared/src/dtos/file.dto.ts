import { BaseDto } from "@crm/shared/dtos/base.dto";
import { Expose } from "class-transformer";

/** DTO файла */
@Expose()
export class FileDto extends BaseDto {

  /** Зашифрованное название */
  @Expose()
  public path: string;

  /** Незашифрованное название */
  @Expose()
  public name: string;

  /** Тип файла */
  @Expose()
  public mime: string;

  /** Размер файла */
  @Expose()
  public size: number;
}
