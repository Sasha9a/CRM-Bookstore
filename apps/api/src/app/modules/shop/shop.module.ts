import { ShopController } from "@crm/api/modules/shop/shop.controller";
import { ShopService } from "@crm/api/modules/shop/shop.service";
import { UserModule } from "@crm/api/modules/user/user.module";
import { Shop, ShopSchema } from "@crm/shared/schemas/shop.schema";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Shop.name, schema: ShopSchema }]),
    UserModule
  ],
  controllers: [ShopController],
  providers: [ShopService],
  exports: [ShopService]
})
export class ShopModule {}
