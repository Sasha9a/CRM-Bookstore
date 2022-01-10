import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

/** Схема БД файла */
@Schema({ versionKey: false })
export class File extends Document {

  /** Зашифрованное название */
  @Prop({ required: true })
  public path: string;

  /** Незашифрованное название */
  @Prop()
  public name: string;

  /** Тип файла */
  @Prop()
  public mime: string;

  /** Размер файла */
  @Prop()
  public size: number;

}

/** Схема БД файла */
export const FileSchema = SchemaFactory.createForClass(File);
