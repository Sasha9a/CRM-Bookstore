import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

/** Схема БД характеристики */
@Schema({ versionKey: false })
export class Characteristic extends Document {

  /** Название */
  @Prop({ required: true })
  public name: string;

  /** Местоположение по очередности */
  @Prop({ required: true })
  public order: number;

}

export const CharacteristicSchema = SchemaFactory.createForClass(Characteristic);
