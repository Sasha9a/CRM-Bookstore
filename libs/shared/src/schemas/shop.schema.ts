import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

/** Схема БД магазина */
@Schema({ versionKey: false })
export class Shop extends Document {

  /** Адрес */
  @Prop({ required: true })
  public address: string;

  /** Метро */
  @Prop()
  public metro: string;

  /** Режим работы */
  @Prop({ required: true })
  public openingHours: string;
}

export const ShopSchema = SchemaFactory.createForClass(Shop);
