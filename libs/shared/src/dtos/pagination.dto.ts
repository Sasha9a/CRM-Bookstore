import { Expose, Transform } from "class-transformer";
import { IsNumber } from "class-validator";

@Expose()
export class PaginationDto {
  @Expose()
  @IsNumber()
  @Transform((param) => parseInt(param.value, 0))
  public limit: number;

  @Expose()
  @IsNumber()
  @Transform((param) => parseInt(param.value, 0))
  public offset: number;

}
