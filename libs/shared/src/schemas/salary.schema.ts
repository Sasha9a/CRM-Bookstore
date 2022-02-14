import { SalaryInfoDto } from "@crm/shared/dtos/salary/salary.info.dto";
import { Shop } from "@crm/shared/schemas/shop.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Document } from "mongoose";

/** Схема БД зарплат */
@Schema({ versionKey: false })
export class Salary extends Document {

  /** Дата начисления зарплаты */
  @Prop({ required: true })
  public date: Date;

  /** Период начала работ */
  @Prop({ required: true })
  public dateFrom: Date;

  /** Период окончания работ */
  @Prop({ required: true })
  public dateTo: Date;

  /** Описание */
  @Prop()
  public description: string;

  /** Магазин */
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Shop.name, autopopulate: true })
  public shop: Shop;

  /** Информация о зарплате списка сотрудников */
  @Prop({ type: [mongoose.Schema.Types.Mixed], required: true })
  public info: SalaryInfoDto[];

  /** Итого сумма зарплаты */
  @Prop({ required: true })
  public sum: number;

}

export const SalarySchema = SchemaFactory.createForClass(Salary);
