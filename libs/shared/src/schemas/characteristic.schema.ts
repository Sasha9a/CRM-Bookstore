import { Category } from "@crm/shared/schemas/category.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Document } from "mongoose";

@Schema({ versionKey: false })
export class Characteristic extends Document {
  @Prop({ required: true })
  public name: string; // Название характеристики

  @Prop({ required: true })
  public order: number; // Местоположение по очередности

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: Category.name })
  public category: Category; // Категория
}

export const CharacteristicSchema = SchemaFactory.createForClass(Characteristic);
