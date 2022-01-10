import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ versionKey: false })
export class File extends Document {
  @Prop({ required: true })
  public path: string; // Зашифрованное название

  @Prop()
  public name: string; // Незашифрованное название

  @Prop()
  public mime: string; // Тип файла

  @Prop()
  public size: number; // Размер файла

}

export const FileSchema = SchemaFactory.createForClass(File);
