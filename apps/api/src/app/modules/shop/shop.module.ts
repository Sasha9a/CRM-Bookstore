import { ShopController } from "@crm/api/modules/shop/shop.controller";
import { ShopService } from "@crm/api/modules/shop/shop.service";
import { Shop, ShopSchema } from "@crm/shared/schemas/shop.schema";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Shop.name, schema: ShopSchema }])
  ],
  controllers: [ShopController],
  providers: [ShopService],
  exports: [ShopService]
})
export class ShopModule {}
