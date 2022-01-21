import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

/** Схема БД магазина */
@Schema({ versionKey: false })
export class Shop extends Document {

  /** Адрес */
  @Prop({ required: true })
  public address: string;

  /** Широта */
  @Prop({ required: true })
  public lat: number;

  /** Долгота */
  @Prop({ required: true })
  public lng: number;

  /** Метро */
  @Prop()
  public metro: string;

  /** Режим работы */
  @Prop({ required: true })
  public openingHours: string;
}

export const ShopSchema = SchemaFactory.createForClass(Shop);
