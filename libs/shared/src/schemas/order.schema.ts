import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ versionKey: false })
export class Order extends Document {



}

export const OrderSchema = SchemaFactory.createForClass(Order);
