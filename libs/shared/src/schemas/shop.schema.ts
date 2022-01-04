import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ versionKey: false })
export class Shop extends Document {
  @Prop({ required: true })
  public address: string; // Адрес

  @Prop()
  public metro: string; // Метро

  @Prop({ required: true })
  public openingHours: string; // Режим работы
}

export const ShopSchema = SchemaFactory.createForClass(Shop);
