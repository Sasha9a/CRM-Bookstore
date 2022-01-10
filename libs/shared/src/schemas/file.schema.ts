import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ versionKey: false })
export class File extends Document {
  @Prop({ required: true })
  public path: string;

  @Prop()
  public name: string;

  @Prop()
  public mime: string;

  @Prop()
  public size: number;

}

export const FileSchema = SchemaFactory.createForClass(File);
