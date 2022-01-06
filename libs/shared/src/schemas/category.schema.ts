import { Characteristic } from "@crm/shared/schemas/characteristic.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Document } from "mongoose";

@Schema({ versionKey: false })
export class Category extends Document {
  @Prop({ required: true })
  public name: string; // Название категории

  @Prop({ type: [{ type: [mongoose.Schema.Types.ObjectId], ref: Characteristic.name }] })
  public characteristics: Characteristic[]; // Список характеристик
}

export const CategorySchema = SchemaFactory.createForClass(Category);
