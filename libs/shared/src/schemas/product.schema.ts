import { Category } from "@crm/shared/schemas/category.schema";
import { File } from "@crm/shared/schemas/file.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Document } from "mongoose";

/** Схема БД товара */
@Schema({ versionKey: false })
export class Product extends Document {

  /** Название */
  @Prop({ required: true })
  public name: string;

  /** Артикул */
  @Prop({ required: true })
  public code: string;

  /** Фото товара */
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: File.name, autopopulate: true })
  public image: File;

  /** Кол-во товара в точках */
  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  public count: Record<string, number>;

  /** Категория */
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Category.name, autopopulate: true })
  public category: Category;

  /** Цена */
  @Prop({ required: true })
  public price: number;

  /** Характеристики */
  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  public characteristics: Record<string, string>;

}

export const ProductSchema = SchemaFactory.createForClass(Product);
