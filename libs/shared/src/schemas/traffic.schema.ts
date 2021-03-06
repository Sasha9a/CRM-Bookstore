import { ShopTrafficDto } from "@crm/shared/dtos/shop/shop.traffic.dto";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Document } from "mongoose";

/** Схема БД трафика */
@Schema({ versionKey: false })
export class Traffic extends Document {

  /** Дата */
  @Prop({ required: true })
  public date: Date;

  /** Данные в каждом магазине */
  @Prop({ type: [mongoose.Schema.Types.Mixed], required: true })
  public shops: ShopTrafficDto[];

  /** Сколько зашло итого */
  @Prop({ required: true })
  public in: number;

  /** Сколько прошло мимо итого */
  @Prop({ required: true })
  public notcome: number;

  /** Конверсия, вход итого */
  @Prop({ required: true })
  public entrance: number;

}

export const TrafficSchema = SchemaFactory.createForClass(Traffic);
