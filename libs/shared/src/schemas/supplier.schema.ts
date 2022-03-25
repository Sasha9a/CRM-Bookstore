import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

/** Схема БД поставщика */
@Schema({ versionKey: false })
export class Supplier extends Document {

  /** Название */
  @Prop({ required: true })
  public name: string;

  /** Дата начала действия договора */
  @Prop({ required: true })
  public dateFrom: Date;

  /** Дата окончания действия договора */
  @Prop({ required: true })
  public dateTo: Date;

  /** Сумма договора */
  @Prop({ requires: true })
  public sum: number;

}

export const SupplierSchema = SchemaFactory.createForClass(Supplier);
