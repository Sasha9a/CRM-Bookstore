import { OrderController } from "@crm/api/modules/order/order.controller";
import { OrderService } from "@crm/api/modules/order/order.service";
import { ProductModule } from "@crm/api/modules/product/product.module";
import { UserModule } from "@crm/api/modules/user/user.module";
import { Order, OrderSchema } from "@crm/shared/schemas/order.schema";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    UserModule,
    ProductModule
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService]
})
export class OrderModule {}
