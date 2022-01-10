import { BaseDto } from "@crm/shared/dtos/base.dto";
import { Expose } from "class-transformer";

@Expose()
export class FileDto extends BaseDto {
  @Expose()
  public path: string;

  @Expose()
  public name: string;

  @Expose()
  public mime: string;

  @Expose()
  public size: number;
}
