import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ versionKey: false })
export class Product extends Document {

}

export const ProductSchema = SchemaFactory.createForClass(Product);
