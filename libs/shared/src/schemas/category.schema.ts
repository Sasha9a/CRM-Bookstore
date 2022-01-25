import { Characteristic } from "@crm/shared/schemas/characteristic.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Document } from "mongoose";

/** Схема БД категории */
@Schema({ versionKey: false })
export class Category extends Document {

  /** Название */
  @Prop({ required: true })
  public name: string;

  /** Родительская категория */
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Category.name, autopopulate: true })
  public parent: Category;

  /** Подкатегории */
  @Prop({ type: [{ type: [mongoose.Schema.Types.ObjectId], ref: Category.name }], autopopulate: true })
  public children: Category[];

  /** Список характеристик */
  @Prop({ type: [{ type: [mongoose.Schema.Types.ObjectId], ref: Characteristic.name }], autopopulate: true })
  public characteristics: Characteristic[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
