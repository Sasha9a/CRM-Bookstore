import { Category } from "@crm/shared/schemas/category.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
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

  /** Категория */
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: Category.name, autopopulate: true })
  public category: Category;
}

export const CharacteristicSchema = SchemaFactory.createForClass(Characteristic);
