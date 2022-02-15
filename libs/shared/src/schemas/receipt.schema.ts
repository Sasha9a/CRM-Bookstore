import { ProductReceiptDto } from "@crm/shared/dtos/product/product.receipt.dto";
import { ShopDto } from "@crm/shared/dtos/shop/shop.dto";
import { UserDto } from "@crm/shared/dtos/user/user.dto";
import { PaymentTypeEnum } from "@crm/shared/enums/payment.type.enum";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Document } from "mongoose";

/** Схема БД чека */
@Schema({ versionKey: false })
export class Receipt extends Document {

  /** Дата совершения покупки */
  @Prop({ required: true })
  public date: Date;

  /** Магазин, где совершена покупка */
  @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
  public shop: ShopDto;

  /** Продавец */
  @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
  public salesman: UserDto;

  /** Товары */
  @Prop({ type: [mongoose.Schema.Types.Mixed], required: true })
  public products: ProductReceiptDto[];

  /** Итоговая цена */
  @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
  public sum: Record<PaymentTypeEnum, number>;

}

export const ReceiptSchema = SchemaFactory.createForClass(Receipt);
