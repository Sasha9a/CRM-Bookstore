import { ProductOrderDto } from "@crm/shared/dtos/product/product.order.dto";
import { ShopDto } from "@crm/shared/dtos/shop/shop.dto";
import { SupplierDto } from "@crm/shared/dtos/supplier/supplier.dto";
import { UserDto } from "@crm/shared/dtos/user/user.dto";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Document } from "mongoose";

/** Схема БД заказа */
@Schema({ versionKey: false })
export class Order extends Document {

  /** Дата совершения заказа */
  @Prop({ required: true })
  public date: Date;

  /** Поставщик */
  @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
  public supplier: SupplierDto;

  /** Магазин, где совершен заказ */
  @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
  public shop: ShopDto;

  /** Кто заказ совершил */
  @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
  public employee: UserDto;

  /** Товары */
  @Prop({ type: [mongoose.Schema.Types.Mixed], required: true })
  public products: ProductOrderDto[];

  /** Сумма */
  @Prop({ required: true })
  public sum: number;

}

export const OrderSchema = SchemaFactory.createForClass(Order);
