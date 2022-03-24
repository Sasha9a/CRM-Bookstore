import { RoleEnum } from "@crm/shared/enums/role.enum";
import { ScheduleEnum } from "@crm/shared/enums/schedule.enum";
import { File } from "@crm/shared/schemas/file.schema";
import { Shop } from "@crm/shared/schemas/shop.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Document } from "mongoose";

/** Схема БД пользователя */
@Schema({ versionKey: false })
export class User extends Document {

  /** Логин */
  @Prop({ required: true })
  public login: string;

  /** Пароль */
  @Prop({ required: true })
  public password: string;

  /** ФИО */
  @Prop({ required: true })
  public name: string;

  /** Дата рождения */
  @Prop({ required: true })
  public dateOfBirth: Date;

  /** Дата начала работы */
  @Prop({ required: true })
  public startDate: Date;

  /** Магазин, где работает */
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Shop.name, autopopulate: true })
  public shop: Shop;

  /** Телефон */
  @Prop()
  public telephone: string;

  /** Адрес проживания */
  @Prop()
  public address: string;

  /** Должность */
  @Prop()
  public position: string;

  /** Роли пользователя */
  @Prop({ required: true })
  public roles: RoleEnum[];

  /** График работы */
  @Prop({ type: String, required: true })
  public schedule: ScheduleEnum;

  /** Зарплата */
  @Prop({ default: 0 })
  public salary: number;

  /** Фото пользователя */
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: File.name, autopopulate: true })
  public avatar: File;

  /** Токен, нужен для авторизации */
  @Prop()
  public token: string;

}

export const UserSchema = SchemaFactory.createForClass(User);
