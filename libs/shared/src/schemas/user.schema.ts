import { RoleEnum } from "@crm/shared/enums/role.enum";
import { Shop } from "@crm/shared/schemas/shop.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Document } from "mongoose";

@Schema({ versionKey: false })
export class User extends Document {
  @Prop({ required: true })
  public login: string; // Логин

  @Prop({ required: true })
  public password: string; // Пароль

  @Prop({ required: true })
  public name: string; // ФИО

  @Prop({ required: true })
  public dateOfBirth: Date; // Дата рождения

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Shop.name })
  public shop: Shop; // Точка, где работает

  @Prop()
  public telephone: string; // Телефон

  @Prop()
  public address: string; // Адрес жительства

  @Prop()
  public position: string; // Должность

  @Prop({ required: true })
  public roles: RoleEnum[]; // Роли пользователя

  @Prop()
  public salary: number; // Зарплата

  @Prop()
  public token: string;

}

export const UserSchema = SchemaFactory.createForClass(User);
